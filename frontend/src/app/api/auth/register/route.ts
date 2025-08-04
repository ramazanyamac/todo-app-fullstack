import { defaultLocale } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Send registration request to backend API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': request.headers.get('accept-language') || defaultLocale,
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ message: data.message, success: true }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: data.message, success: false, details: data.details },
        { status: res.status }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error', success: false }, { status: 500 });
  }
}
