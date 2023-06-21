import { atom } from "recoil";
import { History } from "./types";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const chatHistoryAtom = atom<History>({
  key: "chatHistoryAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const openAiApiKeyAtom = atom<string | null>({
  key: "openAiApiKeyAtom",
  default: new URLSearchParams(window.location.search).get("openAIApiKey"),
});

export const loadingAtom = atom<boolean>({
  key: "loadingAtom",
  default: true,
});
