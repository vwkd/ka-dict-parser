import { ByteCodePointConverter } from "./utils.ts";
const res = await fetch(
  "https://raw.githubusercontent.com/vwkd/kita-verbs-data/main/src/vz.txt",
);
const input = await res.text();
export const inputObj = ByteCodePointConverter(input);
