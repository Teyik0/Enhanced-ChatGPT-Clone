import { NextResponse } from 'next/server';
import prisma from '../../../prisma/client';

export async function POST(request: Request) {
  try {
    const { name, userId } = await request.json();
    const chat = await prisma.chat.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json({ chat });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Hello World' });
  }
}
