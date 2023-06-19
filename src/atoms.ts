import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export const placeholderAtom = atom({
  key: "placeholderAtom",
  default: "Oh Hi Maaark!\nMy name is",
});

export const useTextFieldPlaceholder = () => useRecoilValue(placeholderAtom);

export const useNewPlaceholder = () => useSetRecoilState(placeholderAtom);
