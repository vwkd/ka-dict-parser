import {
  char,
  choice,
} from "$arcsecond";

/*
nl
    UNICODE_NEWLINE_CHARACTER
*/
// todo: maybe use regex(/\n/); ?
export const newlineParser = char(`
`);

/*
ws
    UNICODE_WHITESPACE_CHARACTER
*/
export const whitespaceParser = char(" ");

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
export const superscriptNumberParser = choice([
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