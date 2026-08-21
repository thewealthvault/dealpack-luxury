import { NextResponse } from 'next/server';
import { checkAccess } from '@/config/access';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ authorized: false }, { status: 400 });
    }

    const isAuthorized = checkAccess(email);
    return NextResponse.json({ authorized: isAuthorized }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authorized: false }, { status: 500 });
  }
}
