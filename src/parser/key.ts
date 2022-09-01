import {
  str,
  coroutine,
  choice,
  char,
  sequenceOf,
  many1,
  possibly,
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

const VARIANT = {
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
// note: allow only single hyphen in word
WordKa
    CharKa+
*/
const wordKaParser = many1( charKaParser).map(a => a.join(""));

/*
Index
    WordKa ("-" WordKa)?
*/
const indexParser = coroutine( function* () {
    const word = yield wordKaParser;
    const rest = yield possibly( sequenceOf([
      char("-"),
      wordKaParser,
    ]));
    
    return [
      word,
      ...(rest ?? []),
    ];
}).map(a => a.join(""));

/*
IndexVariant
    Index SuperscriptNumber
*/
const indexVariantParser = coroutine( function* () {
  const index = yield indexParser;
  const superscriptNumber = yield superscriptNumberParser;
  const variant = VARIANT[superscriptNumber];
  
  return {
    variant,
    index,
  };
});

/*
Key
    IndexVariant
    Index
*/
const keyParser = choice([
  indexVariantParser,
  indexParser.map(index => ({
    variant: 1,
    index,
  })),
]);

export default keyParser;