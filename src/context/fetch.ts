import { Session } from 'next-auth';

export async function getChatMessages(chatId: string) {
  const messages = await fetch(`/api/messages/${chatId}`);
  return messages.json();
}

export async function postMessage(
  chatId: string,
  text: string,
  author: string,
  model: string,
  temperature: number,
  openAIKey: string
) {
  const message = await fetch(`/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
      text,
      author,
      model,
      temperature,
      openAIKey,
    }),
  });
  return message.json();
}

export async function getUserChats(userId: string) {
  const chats = await fetch(`/api/chats/${userId}`);
  return chats.json();
}

export async function postChat(userId: string) {
  const chat = await fetch(`/api/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'New Chat', userId }),
  });
  return chat.json();
}

export async function deleteChat(chatId: string) {
  const chat = await fetch(`/api/chats/${chatId}`, {
    method: 'DELETE',
  });
  return chat.json();
}

export async function postUser(session: Session) {
  const user = await fetch(`/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: session!.user!.name!,
      email: session!.user!.email!,
    }),
  });
  return user.json();
}
