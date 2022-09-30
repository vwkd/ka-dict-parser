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
const lineParser = coroutine(run => {
  const source = run(sourceParser);
  run(whitespaceParser);
  const target = run(targetParser);
  
  return {
    source,
    target,
  };
}).errorChain(({error, index}) => {
  const pointIndex = inputObj.getPointIndex(index);
  const lineNumber = inputObj.getLineNumber(pointIndex);
  const lineText = inputObj.getLineText(pointIndex);
  const lineIndex = inputObj.getLineIndex(pointIndex);
  
  console.error(`Error in line ${lineNumber}:`, lineText);
  
  console.error(error.replace(/(?<=position )\d+/, lineIndex));
  
  // skip current line, match anything until next newline without adding line to result
  return skip (many(anyCharExcept(newlineParser)));
});

/*
Text
    Line (nl Line)*
*/
const textParser = sepBy1(newlineParser) (lineParser);

/*
Parser
    ^ Text $
*/
const parser = coroutine(run => {
  run(startOfInput);
  const text = run(textParser);
  run(endOfInput);
  
  return text;
});

export default parser;