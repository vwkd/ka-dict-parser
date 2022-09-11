import {
  coroutine,
  choice,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import { wordKaParser } from "./word.ts";

/*
WordKaMeaning
    WordKa SuperscriptNumber
*/
const wordKaMeaningParser = coroutine( function* () {
  const value = yield wordKaParser;
  const superscriptNumber = yield superscriptNumberParser;
  const meaning = MEANING[superscriptNumber];
  
  return {
    value,
    meaning,
  };
});

/*
Source
    WordKaMeaning
    WordKa
*/
const sourceParser = choice([
  wordKaMeaningParser,
  wordKaParser.map(value => ({
    value,
    meaning: 1,
  })),
]);

export default sourceParser;