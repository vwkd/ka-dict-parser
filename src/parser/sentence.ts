import {
  coroutine,
  choice,
  char,
  sequenceOf,
  many,
  possibly,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import { wordParser } from "./word.ts";

/*
CommaWhitespaceWord
    ","? ws Word
*/
const commaWhitespaceWordParser =
sequenceOf([
  possibly( char(",")),
  whitespaceParser,
  wordParser,
]).map(a => a.filter(e => e != null).join(""));

/*
// todo: assume expanded all shorthands, has no (), od., /, not yet true ❗️
Sentence
    Word CommaWhitespaceWord*
*/
const sentenceDeParser = coroutine( function* () {
  const first = yield wordParser;
  const rest = yield many( commaWhitespaceWordParser);
  
  return [
    first,
    ...rest,
  ].join("");
});

export default sentenceDeParser;
