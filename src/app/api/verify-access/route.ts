import { NextResponse } from 'next/server';
import { checkAccess } from '@/config/access';

// Force Vercel to NEVER cache this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { authorized: false }, 
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const isAuthorized = checkAccess(email);
    return NextResponse.json(
      { authorized: isAuthorized }, 
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch {
    return NextResponse.json(
      { authorized: false }, 
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
