import {
  coroutine,
  choice,
  char,
  recursiveParser,
} from "../deps.ts";

/*
Integer
    DigitNonZero
    DigitNonZero Digits
*/

/*
Digits
    Digit
    Digit Digits
*/

/*
Digit
    "0"
    DigitNonZero
*/

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

export default integerParser;