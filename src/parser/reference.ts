import {
  str,
  coroutine,
  choice,
  char,
  possibly,
  sequenceOf,
  digits,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import sourceParser from "./source.ts";
import tagsWhitespaceParser from "./tags.ts";

/*
Kind
    "Bed." ws "s."
    "s." 
    "id."
*/
const kindParser = choice([
  sequenceOf([
    str("Bed."),
    whitespaceParser,
    str("s."),
  ]).map(a => a.join("")),
  str("s."),
  str("id."),
]);

/*
WhitespaceMeaning
    ws "(Pkt." ws Digit ")"
*/
const whitespaceMeaningParser = coroutine( function* () {
  yield whitespaceParser;
  yield str("(Pkt.");
  yield whitespaceParser;
  const meaning = yield digits;
  yield char(")");

  return meaning;
});

/*
Reference
    TagsWhitespace? Kind ws Source WhitespaceMeaning?
*/
const referenceParser = coroutine( function* () {
  const tags = (yield possibly( tagsWhitespaceParser)) ?? [];
  const kind = yield kindParser;
  yield whitespaceParser;
  const source = yield sourceParser;
  const meaning = (yield possibly( whitespaceMeaningParser)) ?? undefined;

  return {
    source,
    meaning,
    kind,
    tags,
  };
});

export default referenceParser;