import { NextResponse } from 'next/server';
import prisma from '../../../../context/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const chatId = params.id;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'There was an unexpected error' });
  }
}
