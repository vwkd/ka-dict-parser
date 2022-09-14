import {
  coroutine,
  choice,
  char,
  sequenceOf,
  many,
  possibly,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import { wordsParser } from "./word.ts";
import tagsWhitespaceParser from "./tags.ts";

/*
CommaWhitespaceWords
    "," ws Words
*/
const commaWhitespaceWordsParser = coroutine( function* () {
  yield char(",");
  yield whitespaceParser;
  const words = yield wordsParser;
  
  return words;
});

/*
// todo: assume expanded all shorthands, has no (), od., /, not yet true ❗️
Sentence
    TagsWhitespace? Words CommaWhitespaceWords*
*/
const sentenceDeParser = coroutine( function* () {
  const tags = (yield possibly( tagsWhitespaceParser)) ?? [];
  const words = yield wordsParser;
  const wordsList = yield many( commaWhitespaceWordsParser);
  
  const value = [words, ...wordsList];

  return {
    value,
    tags,
  };
});

export default sentenceDeParser;
