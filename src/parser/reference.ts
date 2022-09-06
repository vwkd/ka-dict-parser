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
  ]).map(a => a.join("")),
  str("s."),
  str("id."),
]);

/*
Reference
    (Tags ws)? Kind ws Source
*/
const referenceParser = coroutine( function* () {
  const tags = (yield possibly( sequenceOf([
    tagsParser,
    whitespaceParser
  ]).map(a => a[1]))) ?? [];
  
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