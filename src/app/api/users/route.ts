import { NextResponse } from 'next/server';
import prisma from '../../../context/client';

interface User {
  name: string;
  email: string;
}

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Hello World' });
  }
}

export async function POST(request: Request) {
  try {
    const userParam: User = await request.json();
    const userAlreadyExist = await prisma.user.findMany({
      where: { email: userParam.email },
    });
    if (userAlreadyExist.length === 0) {
      const user = await prisma.user.create({
        data: {
          name: userParam.name,
          email: userParam.email,
        },
      });
      return NextResponse.json({ user });
    }
    return NextResponse.json({
      message: 'User already exist',
      user: userAlreadyExist[0],
    });
  } catch (error) {
    console.log(error);
  }
}
