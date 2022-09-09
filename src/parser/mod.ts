import {
  coroutine,
  choice,
  many,
  startOfInput,
  endOfInput,
} from "../deps.ts";

import { newlineParser, whitespaceParser } from "./chars.ts";
import sourceParser from "./source.ts";
import targetParser from "./target.ts";

const parser = coroutine(function* () {
  yield startOfInput;
  const text = yield textParser;
  yield endOfInput;
  
  return text;
});

/*
Text
    Line NewlineLine*
*/
const textParser = coroutine(function* () {
  const line = yield lineParser;
  const lines = yield many( newlineLineParser);
  
  return [
    line,
    ...lines,
  ];
});

/*
NewlineLine
    nl Line
*/
const newlineLineParser = coroutine(function* () {
  yield newlineParser;
  const line = yield lineParser;
  
  return line;
});

/*
Line
    Source ws Target
*/
const lineParser = coroutine(function* () {
  const source = yield sourceParser;
  yield whitespaceParser;
  const target = yield targetParser;
  
  return {
    source,
    target,
  };
});

export default parser;