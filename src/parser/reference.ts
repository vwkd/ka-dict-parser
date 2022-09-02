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
Type
    "s." ws "Bed."
    "s." 
    "id."
*/
const typeParser = choice([
  sequenceOf([
    str("s."),
    whitespaceParser,
    str("Bed."),
  ]).map(a => "meaning"),
  str("s.").map(s => "direct"),
  str("id.").map(s => "identical"),
]);

/*
Reference
    (Tags ws)? Type ws Source
*/
const referenceParser = coroutine( function* () {
  const tags = (yield possibly( sequenceOf([
    tagsParser,
    whitespaceParser
  ]).map(a => a[1]))) ?? [];
  
  const type_ = yield typeParser;
  yield whitespaceParser;
  const source = yield sourceParser;
  
  return {
    source,
    type: type_,
    tags,
  };
});

export default referenceParser;