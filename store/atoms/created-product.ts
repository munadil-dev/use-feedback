import { atom } from "jotai";

export const createdProductAtom = atom<{ id: string; name: string } | null>(
  null
);
