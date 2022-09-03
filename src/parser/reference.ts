import {
  str,
  coroutine,
  choice,
  char,
  possibly,
  sequenceOf,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import sourceParser from "./source.ts";
import tagsParser from "./tags.ts";

/*
Kind
    "s." ws "Bed."
    "s." 
    "id."
*/
const kindParser = choice([
  sequenceOf([
    str("s."),
    whitespaceParser,
    str("Bed."),
  ]).map(a => "MEANING"),
  str("s.").map(s => "DIRECT"),
  str("id.").map(s => "IDENTICAL"),
]);

/*
Reference
    (Tags ws)? Kind ws Source
*/
const referenceParser = coroutine( function* () {
  const tags = (yield possibly( sequenceOf([
    tagsParser,
    whitespaceParser
  ]).map(a => a[0]))) ?? [];
  
  const kind = yield kindParser;
  yield whitespaceParser;
  const source = yield sourceParser;
  
  return {
    source,
    kind,
    tags,
  };
});

export default referenceParser;