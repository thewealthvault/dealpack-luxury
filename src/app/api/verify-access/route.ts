import { NextResponse } from 'next/server';
import { checkAccess } from '@/config/access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ authorized: false }, { status: 400 });
    return NextResponse.json({ authorized: checkAccess(email) }, { status: 200 });
  } catch {
    return NextResponse.json({ authorized: false }, { status: 500 });
  }
}
