import {
  coroutine,
  char,
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
const categoryParser = coroutine( run => {
  run(whitespaceParser);
  const categoryList = run(between( char("(")) ( char(")")) ( categoryListParser));
  
  return categoryList;
});

/*
Element
    Words Category?
*/
const elementParser = coroutine( run => {
  const value = run(wordsParser);
  const category = (run(possibly( categoryParser)) ?? []);

  return {
    value,
    category,
  };
});

/*
Elements
    Element ("," ws Element)*
*/
const elementsParser = sepBy1( str(", ")) (elementParser);

/*
Field
    TagsWhitespace? Elements
*/
const fieldParser = coroutine( run => {
  const tags = (run(possibly( tagsWhitespaceParser)) ?? []);
  const value = run(elementsParser);

  return {
    value,
    tags,
  };
});

export default fieldParser;
