import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
} from "../deps.ts";

import { newlineParser, whitespaceParser } from "./chars.ts";
import keyParser from "./key.ts";
import referenceParser from "./reference.ts";
import definitionsParser from "./definitions.ts";

/*
Text
    Lines
    Line
*/
// TODO: use startOfInput and endOfInput?
const textParser = recursiveParser( () => choice([
  linesParser,
  lineParser,
]));

/*
Lines
    Line nl Text
*/
const linesParser = coroutine(function* () {
  const line = yield lineParser;
  yield newlineParser;
  const rest = yield textParser;
  const restArr = Array.isArray(rest) ? rest : [rest];
  
  return [
    line,
    ...restArr,
  ];
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

export default textParser;