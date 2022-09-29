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
Parser
    ^ Text $
*/
const parser = coroutine(function* () {
  yield startOfInput;
  const text = yield textParser;
  yield endOfInput;
  
  return text;
});

export default parser;