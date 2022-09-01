import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
  sequenceOf,
  many1,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";

/*
Key
    IndexVariant
    Index
*/
const keyParser = recursiveParser( () => choice([
  indexVariantParser,
  indexParser.map(index => ({
    variant: 1,
    index,
  })),
]));

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
Index
    WordKa "-" WordKa
    WordKa
*/
const indexParser = choice([
  sequenceOf([
    wordKaParser,
    char("-"),
    wordKaParser,
  ]).map(a => a.join(""))
  wordKaParser,
]);

/*
// note: allow only single hyphen in word
WordKa
    CharKa+
*/
const wordKaParser = many1( charKaParser).map(a => a.join(""));

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

export default keyParser;