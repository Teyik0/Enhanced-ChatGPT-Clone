import { NextResponse } from 'next/server';
import prisma from '../../../prisma/client';

type Message = {
  chatId: number;
  text: string;
  author: string;
  model: string;
  temperature: number;
  openAIKey: string;
};

export async function POST(request: Request) {
  const messageParam: Message = await request.json();
  let userMessage;
  try {
    userMessage = await prisma.message.create({
      data: {
        chatId: messageParam.chatId,
        text: messageParam.text,
        author: messageParam.author,
      },
    });
    // return NextResponse.json({ message });
  } catch (error) {
    console.log(error);
    throw new Error('Error creating message');
  }

  let iaResp;
  if (messageParam.model === 'text-davinci-003') {
    iaResp = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          messageParam.openAIKey === ''
            ? process.env.OPENAI_API_KEY
            : messageParam.openAIKey
        }`,
      },
      body: JSON.stringify({
        model: messageParam.model,
        prompt: messageParam.text,
        max_tokens: 1000,
        temperature: messageParam.temperature,
      }),
    })
      .then((resp) => resp.json())
      .catch((err) => console.log(err));
    iaResp = iaResp.choices[0].text;
  } else if (!messageParam.model.includes('davinci')) {
    iaResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          messageParam.openAIKey === ''
            ? process.env.OPENAI_API_KEY
            : messageParam.openAIKey
        }`,
      },
      body: JSON.stringify({
        model: messageParam.model,
        messages: [{ role: 'user', content: messageParam.text }],
        max_tokens: 1000,
        temperature: messageParam.temperature,
      }),
    })
      .then((resp) => resp.json())
      .catch((err) => console.log(err));
    iaResp = iaResp.choices[0].message.content;
  }

  try {
    const iaMessage = await prisma.message.create({
      data: {
        chatId: messageParam.chatId,
        text: iaResp || 'The IA was unable to answer your question !',
        author: 'ChatBot',
      },
    });
    return NextResponse.json({ iaMessage, userMessage });
  } catch (error) {
    console.log(error);
    throw new Error('Error creating message');
  }
}
