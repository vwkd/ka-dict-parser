import {
  coroutine,
  choice,
  char,
  sequenceOf,
  many,
  possibly,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import { wordDeParser } from "./word.ts";

/*
CommaWhitespaceWordDe
    ","? ws WordDe
*/
const commaWhitespaceWordDeParser =
sequenceOf([
  possibly( char(",")),
  whitespaceParser,
  wordDeParser,
]).map(a => a.filter(e => e != null).join(""));

/*
// todo: assume expanded all shorthands, has no (), od., /, not yet true ❗️
// todo: sentence might contain WordKa ❗️
Sentence
    WordDe CommaWhitespaceWordDe*
*/
const sentenceDeParser = coroutine( function* () {
  const first = yield wordDeParser;
  const rest = yield many( commaWhitespaceWordDeParser);
  
  return [
    first,
    ...rest,
  ].join("");
});

export default sentenceDeParser;
