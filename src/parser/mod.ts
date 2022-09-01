import {
  str,
  coroutine,
  choice,
  char,
  many,
  startOfInput,
  endOfInput,
} from "../deps.ts";

import { newlineParser, whitespaceParser } from "./chars.ts";
import keyParser from "./key.ts";
import referenceParser from "./reference.ts";
import definitionsParser from "./definitions.ts";

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
// TODO: use startOfInput and endOfInput?
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
    Key ws Value
*/
const lineParser = coroutine(function* () {
  const key = yield keyParser;
  yield whitespaceParser;
  const value = yield valueParser;
  
  return {
    key,
    value,
  };
});

/*
Value
    Reference
    Definitions
*/
const valueParser = choice([
  referenceParser,
  definitionsParser,
]);

export default parser;