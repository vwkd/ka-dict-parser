import {
  coroutine,
  choice,
} from "$arcsecond";

import { whitespaceParser, superscriptNumberParser } from "./chars.ts";
import { wordKaParser } from "./word.ts";

const MEANING = {
  "¹": 1,
  "²": 2,
  "³": 3,
  "⁴": 4,
  "⁵": 5,
  "⁶": 6,
  "⁷": 7,
  "⁸": 8,
  "⁹": 9,
}

/*
WordKaMeaning
    WordKa SuperscriptNumber
*/
const wordKaMeaningParser = coroutine(run => {
  const value = run(wordKaParser);
  const superscriptNumber = run(superscriptNumberParser);
  
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
  })),
]);

export default sourceParser;