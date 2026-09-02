import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedImage } from '@/services/storage';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to upload photos for skin analysis.' },
        { status: 401 }
      );
    }

    let imageBase64: string | null = null;
    const contentType = req.headers.get('content-type') || '';

    // 2. Parse Multipart/Form-Data if provided
    if (contentType.includes('multipart/form-data')) {
      let formData: FormData;
      try {
        formData = await req.formData();
      } catch (err: any) {
        return NextResponse.json(
          { error: 'Failed to parse multipart form data: ' + (err.message || 'Malformed body') },
          { status: 400 }
        );
      }

      const file = formData.get('file') || formData.get('image') || formData.get('photo');
      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: 'No image file found in form data. Expected field "file", "image", or "photo".' },
          { status: 400 }
        );
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: 'Image size exceeds maximum limit of 4MB. Please choose a smaller photo.' },
          { status: 413 }
        );
      }

      if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: 'Unsupported file format. Please upload a JPEG, PNG, or WEBP image.' },
          { status: 415 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mime = file.type || 'image/jpeg';
      imageBase64 = `data:${mime};base64,${buffer.toString('base64')}`;
    } else {
      // 3. Parse JSON body
      let body: any;
      try {
        body = await req.json();
      } catch (err) {
        return NextResponse.json(
          { error: 'Invalid JSON request payload' },
          { status: 400 }
        );
      }

      imageBase64 = body?.imageBase64 || body?.image || body?.photo || null;

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return NextResponse.json(
          { error: 'Image data is required' },
          { status: 400 }
        );
      }

      // Check base64 string length limit (~4MB binary is ~5.6MB base64)
      if (imageBase64.length > 6 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image size exceeds maximum limit of 4MB. Please choose a smaller photo.' },
          { status: 413 }
        );
      }

      // Format check
      if (imageBase64.startsWith('data:')) {
        const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        if (!match || !ALLOWED_MIME_TYPES.includes(match[1].toLowerCase())) {
          return NextResponse.json(
            { error: 'Unsupported file format. Please upload a JPEG, PNG, or WEBP image.' },
            { status: 415 }
          );
        }
      } else {
        // Raw base64 string without data prefix
        imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
      }
    }

    // 4. Save and generate public image URL
    const saved = await saveUploadedImage(imageBase64, 'face_capture');

    return NextResponse.json(
      {
        success: true,
        imageUrl: saved.publicUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Image upload error:', error);
    const status = error.message?.includes('exceeds maximum') ? 413 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to process and store image' },
      { status }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Please use POST to upload face photos.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Please use POST to upload face photos.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Please use POST to upload face photos.' },
    { status: 405 }
  );
}
