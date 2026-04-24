import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Karmesh Broasted API is running' });
}

export async function POST() {
  return NextResponse.json({ message: 'OK' });
}
