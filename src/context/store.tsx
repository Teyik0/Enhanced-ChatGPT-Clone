"use client";

import { atom, Provider } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Chat = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  id: string;
  text: string;
  createdAt: string;
  chatId: string;
  author: string;
};

export const modelAtom = atom<string>("text-davinci-003");
export const temperatureAtom = atom<number>(0.7);
export const openAIKeyAtom = atom<string>("");
// export const modelAtom = atomWithStorage<string>("model", "text-davinci-003");
// export const temperatureAtom = atomWithStorage<number>("temperature", 0.7);
// export const openAIKeyAtom = atomWithStorage<string>("openAIKey", "");
export const currentChatIdAtom = atom<string | undefined>("");
export const userIdAtom = atom<string>("");
export const userChatsAtom = atom<Chat[]>([]);
export const chatMessagesAtom = atom<Message[]>([]);
export const toggleMenuAtom = atom<boolean>(false);

export function Providers({ children }: any) {
  return <Provider>{children}</Provider>;
}
