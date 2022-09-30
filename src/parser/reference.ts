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
const whitespaceMeaningParser = coroutine( run => {
  run(whitespaceParser);
  run(str("(Pkt."));
  run(whitespaceParser);
  const meaning = run(digits);
  run(char(")"));

  return meaning;
});

/*
Reference
    TagsWhitespace? Kind ws Source WhitespaceMeaning?
*/
const referenceParser = coroutine( run => {
  const tags = (run(possibly( tagsWhitespaceParser)) ?? []);
  const kind = run(kindParser);
  run(whitespaceParser);
  const source = run(sourceParser);
  const meaning = (run(possibly( whitespaceMeaningParser)) ?? undefined);

  return {
    source,
    meaning,
    kind,
    tags,
  };
});

export default referenceParser;