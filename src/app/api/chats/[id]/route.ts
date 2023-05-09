import { NextResponse } from 'next/server';
import prisma from '@/context/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: userId },
    });
    return NextResponse.json({ chats });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'There was an unexpected error' });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const chatId = params.id;
  try {
    const messages = await prisma.message.deleteMany({
      where: { chatId },
    });
    const chats = await prisma.chat.deleteMany({
      where: { id: chatId },
    });
    return NextResponse.json({ chats });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'There was an unexpected error' });
  }
}
