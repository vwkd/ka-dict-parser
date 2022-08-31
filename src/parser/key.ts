import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
  sequenceOf,
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
    WordKa
*/
const indexParser = recursiveParser( () => wordKaParser);

/*
WordKa
    CharKa WordKa
    CharKa
    CharKa "-" WordKa
*/
const wordKaParser = recursiveParser( () => choice([
  sequenceOf([
    charKaParser,
    wordKaParser,
  ]).map(a => a.join("")),
  charKaParser,
  sequenceOf([
    charKaParser,
    char("-"),
    wordKaParser,
  ]).map(a => a.join("")),
]));

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