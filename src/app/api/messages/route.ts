import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import prisma from '../../../prisma/client';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(config);

type Message = {
  chatId: number;
  text: string;
  author: string;
  model: string;
  temperature: number;
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

  const iaResp = await openai
    .createCompletion({
      model: `${messageParam.model}`,
      prompt: messageParam.text,
      temperature: messageParam.temperature,
      max_tokens: 1000,
    })
    .then((resp) => resp.data.choices[0].text)
    .catch(
      (err) =>
        `The IA was unable to answer your question !\n (Error: ${err.message})`
    );

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
