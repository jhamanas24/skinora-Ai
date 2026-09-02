import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedImage } from '@/services/storage';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to upload photos for skin analysis.' },
        { status: 401 }
      );
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const saved = await saveUploadedImage(imageBase64, 'face_capture');

    return NextResponse.json({
      success: true,
      imageUrl: saved.publicUrl,
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process and store image' },
      { status: 500 }
    );
  }
}
