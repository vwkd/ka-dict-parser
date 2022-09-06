import {
  coroutine,
  choice,
  char,
  sequenceOf,
  many1,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";

/*
// todo: maybe more?
SuperscriptNumber
    "¹"
    "²"
    "³"
    "⁴"
    "⁵"
    "⁶"
    "⁷"
    "⁸"
    "⁹"
*/
const superscriptNumberParser = choice([
  char("¹"),
  char("²"),
  char("³"),
  char("⁴"),
  char("⁵"),
  char("⁶"),
  char("⁷"),
  char("⁸"),
  char("⁹"),
]);

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
CharKa
    UNICODE_GEORGIAN_CHARACTER
*/
// beware: not complete Unicode block!
const charKaParser = choice([
  char("ა"),
  char("ბ"),
  char("გ"),
  char("დ"),
  char("ე"),
  char("ვ"),
  char("ზ"),
  char("თ"),
  char("ი"),
  char("კ"),
  char("ლ"),
  char("მ"),
  char("ნ"),
  char("ო"),
  char("პ"),
  char("ჟ"),
  char("რ"),
  char("ს"),
  char("ტ"),
  char("უ"),
  char("ფ"),
  char("ქ"),
  char("ღ"),
  char("ყ"),
  char("შ"),
  char("ჩ"),
  char("ც"),
  char("ძ"),
  char("წ"),
  char("ჭ"),
  char("ხ"),
  char("ჯ"),
  char("ჰ"),
]);

/*
CharsKa
    CharKa+
*/
const charsKaParser = many1( charKaParser).map(a => a.join(""));

/*
// note: allow only single hyphen in word
WordKaHyphen
    CharsKa "-" CharsKa
*/
const wordKaHyphenParser = sequenceOf([
  charsKaParser,
  char("-"),
  charsKaParser,
]).map(a => a.join(""));

/*
WordKa
    WordKaHyphen
    CharsKa
*/
const wordKaParser = choice([
  wordKaHyphenParser,
  charsKaParser
]);

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