import {
  coroutine,
  choice,
  char,
  sequenceOf,
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
WordDe
    CharDeBig CharDeSmall+
    CharDeSmall{2,}
*/
const wordDeParser = choice([
  coroutine( function* () {
    const first = yield charDeBigParser;
    const rest = yield many1( charDeSmallParser);

    return [
      first,
      ...rest,
    ];
  }),
  coroutine( function* () {
    const first = yield charDeSmallParser;
    const rest = yield many1( charDeSmallParser);

    return [
      first,
      ...rest,
    ];
  }),
]).map(a => a.join(""));

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
// note: allow only single hyphen in word, note: in grammar is two words
WordsDe
    WordDe "-" WordDe
    WordDe WhitespaceWordDe+
*/
const wordsDeParser = choice([
  sequenceOf([
    wordDeParser,
    char("-"),
    wordDeParser,
  ]),
  coroutine( function* () {
    const first = yield wordDeParser;
    const rest = yield many1( whitespaceWordDeParser);

    return [
      first,
      ...rest,
    ];
  }),
]).map(a => a.join(""));

export default wordsDeParser;