import {
  coroutine,
  char,
  many,
  sepBy1,
  possibly,
  str,
  between,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import { wordsParser } from "./word.ts";
import tagsWhitespaceParser from "./tags.ts";

/*
CategoryList
    Words ("," ws Words)*
*/
const categoryListParser = sepBy1( str(", ")) (wordsParser);

/*
Category
    ws "(" CategoryList ")"
*/
const categoryParser = coroutine( function* () {
  yield whitespaceParser
  const categoryList = yield between( char("(")) ( char(")")) ( categoryListParser);
  
  return categoryList;
});

/*
Element
    Words Category?
*/
const elementParser = coroutine( function* () {
  const value = yield wordsParser;
  const category = (yield possibly( categoryParser)) ?? [];

  return {
    value,
    category,
  };
});

/*
CommaWhitespaceElement
    "," ws Element
*/
const commaWhitespaceElementParser = coroutine( function* () {
  yield char(",");
  yield whitespaceParser;
  const element = yield elementParser;
  
  return element;
});

/*
Elements
    Element CommaWhitespaceElement*
*/
const elementsParser = coroutine( function* () {
  const element = yield elementParser;
  const elementList = yield many( commaWhitespaceElementParser);

  return [
    element,
    ...elementList,
  ];
});

/*
Field
    TagsWhitespace? Elements
*/
const fieldParser = coroutine( function* () {
  const tags = (yield possibly( tagsWhitespaceParser)) ?? [];
  const value = yield elementsParser;

  return {
    value,
    tags,
  };
});

export default fieldParser;
