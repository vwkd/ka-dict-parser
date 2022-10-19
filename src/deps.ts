export {
  str,
  sequenceOf,
  coroutine,
  choice,
  char,
  possibly,
  many,
  many1,
  between,
  startOfInput,
  endOfInput,
  digits,
  anyCharExcept,
  skip,
  getData,
  setData,
  withData,
} from "https://cdn.skypack.dev/arcsecond@v5.0.0";
import {
  sequenceOf,
  many,
} from "https://cdn.skypack.dev/arcsecond@v5.0.0";
export { equal } from "https://deno.land/std@0.154.0/testing/asserts.ts";
export { default as uuidByString } from "https://cdn.skypack.dev/uuid-by-string@4.0.0";

// fixed version, see https://github.com/francisrstokes/arcsecond/issues/98
export const sepBy1 = separator => value => sequenceOf([
  value,
  many(sequenceOf([
    separator,
    value
  ]).map(a => a[1])),
]).map(([e, r]) => [e, ...r]);

import { ByteCodePointConverter } from "./utils.ts";
const res = await fetch("https://raw.githubusercontent.com/vwkd/kita-verbs/main/vz/vz.txt");
const input = await res.text();
export const inputObj = ByteCodePointConverter(input);