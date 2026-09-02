import path from 'path';

export interface SaveImageResult {
  filePath: string;
  publicUrl: string;
}

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB safe limit for Vercel

/**
 * Upload an image to Cloudinary via REST API if configured
 */
async function uploadToCloudinary(
  dataUri: string,
  filename: string
): Promise<string | null> {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    (process.env.CLOUDINARY_URL?.split('@')[1] || '');
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName) return null;

  try {
    const formData = new URLSearchParams();
    formData.append('file', dataUri);
    formData.append('public_id', filename.replace(/\.[^/.]+$/, ''));

    if (uploadPreset) {
      formData.append('upload_preset', uploadPreset);
    } else if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      formData.append('timestamp', timestamp);
      formData.append('api_key', apiKey);
      const crypto = await import('crypto');
      const signatureStr = `public_id=${filename.replace(/\.[^/.]+$/, '')}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');
      formData.append('signature', signature);
    } else {
      return null;
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Cloudinary upload warning:', errText);
      return null;
    }

    const result = await res.json();
    return result.secure_url || null;
  } catch (err) {
    console.warn('Cloudinary upload error:', err);
    return null;
  }
}

/**
 * Upload an image to Vercel Blob via REST API if configured
 */
async function uploadToVercelBlob(
  buffer: Buffer,
  filename: string
): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`https://blob.vercel.com/${filename}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-add-random-suffix': 'true',
      },
      body: new Uint8Array(buffer),
    });

    if (!res.ok) {
      console.warn('Vercel Blob upload failed:', await res.text());
      return null;
    }

    const result = await res.json();
    return result.url || null;
  } catch (err) {
    console.warn('Vercel Blob upload error:', err);
    return null;
  }
}

/**
 * Save an uploaded image safely across both local and serverless environments.
 */
export async function saveUploadedImage(
  base64Data: string,
  filenamePrefix = 'capture'
): Promise<SaveImageResult> {
  // Determine MIME type and extract clean base64 payload
  const mimeMatch = base64Data.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Image, 'base64');

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image size exceeds maximum limit of 4MB');
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const fileName = `${filenamePrefix}_${timestamp}_${randomStr}.${extension}`;
  const fullDataUri = `data:${mimeType};base64,${base64Image}`;

  // 1. Try Cloudinary if configured
  const cloudinaryUrl = await uploadToCloudinary(fullDataUri, fileName);
  if (cloudinaryUrl) {
    return {
      filePath: fileName,
      publicUrl: cloudinaryUrl,
    };
  }

  // 2. Try Vercel Blob if configured
  const blobUrl = await uploadToVercelBlob(buffer, fileName);
  if (blobUrl) {
    return {
      filePath: fileName,
      publicUrl: blobUrl,
    };
  }

  // 3. In Serverless production (e.g. Vercel), DO NOT write to local filesystem
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless || process.env.NODE_ENV === 'production') {
    // In production without external cloud storage configured,
    // safely return the data URI directly.
    return {
      filePath: fileName,
      publicUrl: fullDataUri,
    };
  }

  // 4. In Local Development, attempt writing to public/uploads safely
  try {
    const fs = await import('fs');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    return {
      filePath,
      publicUrl: `/uploads/${fileName}`,
    };
  } catch (fsError) {
    console.warn('Local filesystem write failed, falling back to data URI:', fsError);
    return {
      filePath: fileName,
      publicUrl: fullDataUri,
    };
  }
}

/**
 * Delete an uploaded image safely without crashing on missing files or cloud URLs
 */
export async function deleteUploadedImage(publicUrl: string): Promise<boolean> {
  try {
    if (!publicUrl) return true;

    // Data URLs do not consume disk space
    if (publicUrl.startsWith('data:')) {
      return true;
    }

    // Local file path
    if (publicUrl.startsWith('/uploads/')) {
      const fs = await import('fs');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const fileName = path.basename(publicUrl);
      const filePath = path.join(uploadDir, fileName);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
    }

    return true;
  } catch (err) {
    console.warn('Error deleting image:', err);
    return false;
  }
}
