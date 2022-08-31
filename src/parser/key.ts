import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";

/*
Key
    IndexVariant
    Index
*/

/*
IndexVariant
    Index SuperscriptNumber
    
Index
    WordKa
*/

/*
WordsKa
    WordKa ws WordsKa
    WordKa
*/

/*
WordKa
    CharKa WordKa
    CharKa
    CharKa "-" WordKa
*/

/*
CharKa
    UNICODE_GEORGIAN_CHARACTER
*/

/*
// todo: maybe more?
SuperscriptNumber
    "¹"
    "²"
    "³"
    "⁴"
    "⁵"
    "⁶"
    "⁷"
    "⁸"
    "⁹"
*/

export default keyParser;