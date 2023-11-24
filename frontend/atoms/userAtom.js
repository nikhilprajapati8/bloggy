import { atom } from "recoil";

export const userAtom = atom({
  key: "user-atom",
  default: JSON.parse(localStorage.getItem("user")),
});