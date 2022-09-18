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
Categories
    "z.B. "? Words CommaWhitespaceWords*
*/
const categoriesParser = coroutine( function* () {
  yield possibly( str("z.B. "));
  const category = yield wordsParser;
  const categoryList = yield many( commaWhitedpaceWordsParser);
  
  return [
    category,
    ...categoryList
  ];
});

/*
Category
    "(" Categories ")"
*/
const categoryParser = coroutine( function* () {
  yield char("(");
  const categories = yield categoriesParser;
  yield char(")");
  
  return categories;
});

/*
WhitespaceCategory
    ws Category
*/
const whitespaceCategoryParser = coroutine( function* () {
  yield whitespaceParser;
  const category = yield categoryParser;
  
  return category;
});

/*
CommaWhitespaceWordsWhitespaceCategory
    CommaWhitespaceWords WhitespaceCategory?
*/
const commaWhitespaceWordsWhitespaceCategoryParser = coroutine( function* () {
  const value = yield commaWhitespaceWordsParser;
  const category = (yield possibly( whitespaceCategoryParser)) ?? [];

  return {
      value,
      category,
    };
});

/*
Sentence
    Words WhitespaceCategory? CommaWhitespaceWordsWhitespaceCategory*
*/
const sentenceParser = coroutine( function* () {
  const value = yield wordsParser;
  const category = (yield possibly( whitespaceCategoryParser)) ?? [];
  const valueList = yield many( commaWhitespaceWordsWhitespaceCategoryParser);

  return [
    {
      value,
      category,
    },
    ...valueList,
  ];
});

/*
Field
    TagsWhitespace? Sentence
*/
const fieldParser = coroutine( function* () {
  const tags = (yield possibly( tagsWhitespaceParser)) ?? [];
  const value = yield sentenceParser;

  return {
    value,
    tags,
  };
});

export default fieldParser;
