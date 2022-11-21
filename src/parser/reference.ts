import {
  char,
  choice,
  coroutine,
  digits,
  possibly,
  sequenceOf,
  str,
} from "$arcsecond";

import { whitespaceParser } from "./chars.ts";
import sourceParser from "./source.ts";
import tagsWhitespaceParser from "./tags.ts";

/*
Kind
    "Bed." ws "s."
    "s."
    "id."
*/
/* Rename reference kind
* expand word and make uppercase
*/
const kindParser = choice([
  sequenceOf([
    str("Bed."),
    whitespaceParser,
    str("s."),
  ]).map(() => "MEANING"),
  str("s.").map(() => "DIRECT"),
  str("id.").map(() => "IDENTICAL"),
]);

/*
WhitespaceMeaning
    ws "(Pkt." ws Digit ")"
*/
const whitespaceMeaningParser = coroutine((run) => {
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
const referenceParser = coroutine((run) => {
  const tags = (run(possibly(tagsWhitespaceParser)) ?? []);
  const kind = run(kindParser);
  run(whitespaceParser);
  const source = run(sourceParser);
  const meaning = (run(possibly(whitespaceMeaningParser)) ?? undefined);

  return {
    source,
    meaning,
    kind,
    tags,
  };
});

export default referenceParser;
