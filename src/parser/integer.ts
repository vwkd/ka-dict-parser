import {
  coroutine,
  choice,
  char,
  recursiveParser,
  sequenceOf,
} from "../deps.ts";

/*
Integer
    DigitNonZero
    DigitNonZero Digits
*/
const integerParser = choice([
  digitNonZeroParser,
  sequenceOf([digitNonZeroParser, digitsParser]).map(a => a.join("")),
]);

/*
Digits
    Digit
    Digit Digits
*/
const digitsParser = recursiveParser( () => choice([
  digitParser,
  sequenceOf([digitParser, digitsParser]).map(a => a.join("")),
]));

/*
Digit
    "0"
    DigitNonZero
*/
const digitParser = choice([
  char("0"),
  digitNonZeroParser
]);

/*
DigitNonZero
    "1"
    "2"
    "3"
    "4"
    "5"
    "6"
    "7"
    "8"
    "9"
*/
const digitNonZeroParser = choice([
  char("1"),
  char("2"),
  char("3"),
  char("4"),
  char("5"),
  char("6"),
  char("7"),
  char("8"),
  char("9"),
]);

export default integerParser;