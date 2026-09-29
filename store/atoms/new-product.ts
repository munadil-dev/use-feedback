import { atomWithReset } from "jotai/utils";

export const newProductAtom = atomWithReset({
  name: "",
  title: "",
  message: "",
});
