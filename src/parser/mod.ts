import {
  coroutine,
  choice,
  many,
  startOfInput,
  endOfInput,
  withData,
  setData,
  getData,  
} from "../deps.ts";

import { newlineParser, whitespaceParser } from "./chars.ts";
import sourceParser from "./source.ts";
import referenceParser from "./reference.ts";
import targetParser from "./target.ts";

const parser = coroutine(function* () {
  yield startOfInput;
  const text = yield textParser({ lineNumber: 1});
  yield endOfInput;
  
  return text;
});

/*
Text
    Line NewlineLine*
*/
const textParser = withData( coroutine(function* () {
  const line = yield lineParser;
  const lines = yield many( newlineLineParser);
  
  return [
    line,
    ...lines,
  ];
}));

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
    Source ws TargetOrReference
*/
const lineParser = coroutine(function* () {
  const source = yield sourceParser;
  yield whitespaceParser;
  const targetOrReference = yield targetOrReferenceParser;
  
  let { lineNumber } = yield getData;
  
  const id = lineNumber;
  
  lineNumber += 1;
  
  yield setData({ lineNumber });
  
  const isTarget = Array.isArray(targetOrReference);
  
  return {
    id,
    source,
    ...(isTarget ? { target: targetOrReference } : { reference: targetOrReference }),
  };
});

/*
TargetOrReference
    Reference
    Target
*/
const targetOrReferenceParser = choice([
  referenceParser,
  targetParser,
]);

export default parser;