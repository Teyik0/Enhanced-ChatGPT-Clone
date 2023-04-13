import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: parseInt(userId) },
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
      where: { chatId: parseInt(chatId) },
    });
    const chats = await prisma.chat.deleteMany({
      where: { id: parseInt(chatId) },
    });
    return NextResponse.json({ chats });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'There was an unexpected error' });
  }
}
