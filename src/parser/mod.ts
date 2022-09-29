import {
  coroutine,
  choice,
  sepBy1,
  startOfInput,
  endOfInput,
  many,
  anyCharExcept,
  skip,
} from "../deps.ts";

import { newlineParser, whitespaceParser } from "./chars.ts";
import sourceParser from "./source.ts";
import targetParser from "./target.ts";
import { inputObj } from "../deps.ts";

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
}).errorChain(({error, index}) => {
  console.error("Error in line", error.replace(/(?<=position )\d+/, inputObj.getPointIndex(index)));
  
  // skip current line, match anything until next newline without adding line to result
  return skip (many( anyCharExcept( newlineParser)));
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