import {
  coroutine,
  choice,
  sepBy1,
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
Text
    Line (nl Line)*
*/
const textParser = sepBy1( newlineParser) (lineParser);

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