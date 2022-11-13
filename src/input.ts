import { ByteCodePointConverter } from "./utils.ts";
const res = await fetch("https://raw.githubusercontent.com/vwkd/kita-verbs/main/vz/vz.txt");
const input = await res.text();
export const inputObj = ByteCodePointConverter(input);