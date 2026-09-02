import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { UserSession } from '@/types';

const SECRET_KEY = process.env.JWT_SECRET || 'skinora_development_secret_key_32_bytes_long_min_len';
const key = new TextEncoder().encode(SECRET_KEY);

export const COOKIE_NAME = 'skinora_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSession;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(req?: Request): Promise<UserSession | null> {
  try {
    let token: string | undefined;

    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      try {
        const cookieStore = cookies();
        token = cookieStore.get(COOKIE_NAME)?.value;
      } catch {
        // cookies() may throw if called outside Next.js request context
      }
    }

    if (!token) return null;
    return await verifySessionToken(token);
  } catch (err) {
    console.warn('getCurrentUser error:', err);
    return null;
  }
}
