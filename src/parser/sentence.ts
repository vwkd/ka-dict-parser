import {
  coroutine,
  choice,
  char,
  sequenceOf,
  many,
  many1,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";

/*
CharDeBig
    UNICODE_GERMAN_BIG_CHARACTER
*/
// beware: not complete Unicode block!
const charDeBigParser = choice([
  char("A"),
  char("B"),
  char("C"),
  char("D"),
  char("E"),
  char("F"),
  char("G"),
  char("H"),
  char("I"),
  char("J"),
  char("K"),
  char("L"),
  char("M"),
  char("N"),
  char("O"),
  char("P"),
  char("Q"),
  char("R"),
  char("S"),
  char("T"),
  char("U"),
  char("V"),
  char("W"),
  char("X"),
  char("Y"),
  char("Z"),
  char("Ä"),
  char("Ö"),
  char("Ü"),
  char("ẞ"),
]);

/*
CharDeSmall
    UNICODE_GERMAN_SMALL_CHARACTER
*/
// beware: not complete Unicode block!
const charDeSmallParser = choice([
  char("a"),
  char("b"),
  char("c"),
  char("d"),
  char("e"),
  char("f"),
  char("g"),
  char("h"),
  char("i"),
  char("j"),
  char("k"),
  char("l"),
  char("m"),
  char("n"),
  char("o"),
  char("p"),
  char("q"),
  char("r"),
  char("s"),
  char("t"),
  char("u"),
  char("v"),
  char("w"),
  char("x"),
  char("y"),
  char("z"),
  char("ä"),
  char("ö"),
  char("ü"),
  char("ß"),
]);

/*
// note: require at least two letters
WordDeBig
    CharDeBig CharDeSmall+
*/
const wordDeBigParser = coroutine( function* () {
  const first = yield charDeBigParser;
  const rest = yield many1( charDeSmallParser);

  return [
    first,
    ...rest,
  ].join("");
});

/*
// note: require at least two letters
WordDeSmall
    CharDeSmall{2,}
*/
const wordDeSmallParser = coroutine( function* () {
  const first = yield charDeSmallParser;
  const rest = yield many1( charDeSmallParser);

  return [
    first,
    ...rest,
  ].join("");
});

/*
// todo: allow WordDeSmall?
WordDeHyphen
    WordDeBig "-" WordDeBig
*/
const wordDeHyphenParser = sequenceOf([
  wordDeBigParser,
  char("-"),
  wordDeBigParser,
]).map(a => a.join(""));

/*
WordDe
    WordDeBig
    WordDeSmall
    WordDeHyphen
*/
const wordDeParser = choice([
  wordDeBigParser,
  wordDeSmallParser,
  wordDeHyphenParser,
]);

/*
WhitespaceWordDe
    ws WordDe
*/
const whitespaceWordDeParser =
coroutine( function* () {
  yield whitespaceParser;
  const word = yield wordDeParser;

  return word;
});

/*
// todo: assume expanded all shorthands, has no (), od., /, ;, not yet true ❗️
WordsDe
    WordDe WhitespaceWordDe*
*/
const wordsDeParser = coroutine( function* () {
  const first = yield wordDeParser;
  const rest = yield many( whitespaceWordDeParser);
  
  return [
    first,
    ...rest,
  ].join("");
});

export default wordsDeParser;