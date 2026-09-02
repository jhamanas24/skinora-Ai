import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface SaveImageResult {
  filePath: string;
  publicUrl: string;
}

export async function saveUploadedImage(
  base64Data: string,
  filenamePrefix = 'capture'
): Promise<SaveImageResult> {
  // Strip Base64 header if present
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Image, 'base64');

  // Max 10MB check
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('Image size exceeds maximum limit of 10MB');
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileName = `${filenamePrefix}_${timestamp}_${randomStr}.jpg`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  await fs.promises.writeFile(filePath, buffer);

  return {
    filePath,
    publicUrl: `/uploads/${fileName}`,
  };
}

export async function deleteUploadedImage(publicUrl: string): Promise<boolean> {
  try {
    const fileName = path.basename(publicUrl);
    const filePath = path.join(UPLOAD_DIR, fileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error deleting image:', err);
    return false;
  }
}
