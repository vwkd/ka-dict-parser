import {
  coroutine,
  choice,
  char,
  sequenceOf,
  many1,
  sepBy1,
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
CharKaSmall
    UNICODE_GEORGIAN_CHARACTER
*/
// beware: not complete Unicode block!
const charKaSmallParser = choice([
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
// note: allow one letter
WordKaSmall
    CharKaSmall+
*/
const wordKaSmallParser = coroutine( run => {
  const chars = run(many1( charKaSmallParser));

  return chars.join("");
});

/*
// note: require at least two letters
WordDeBig
    CharDeBig CharDeSmall+
*/
const wordDeBigParser = coroutine( run => {
  const char = run(charDeBigParser);
  const chars = run(many1( charDeSmallParser));

  return [
    char,
    ...chars,
  ].join("");
});

/*
// note: require at least two letters
WordDeSmall
    CharDeSmall{2,}
*/
const wordDeSmallParser = coroutine( run => {
  const char = run(charDeSmallParser);
  const chars = run(many1( charDeSmallParser));

  return [
    char,
    ...chars,
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
// note: allow only single hyphen in word
WordKaHyphen
    WordKaSmall "-" WordKaSmall
    WordKaSmall "-" WordDeBig
*/
const wordKaHyphenParser = choice([
  sequenceOf([
    wordKaSmallParser,
    char("-"),
    wordKaSmallParser,
  ]).map(a => a.join("")),
  sequenceOf([
    wordKaSmallParser,
    char("-"),
    wordDeBigParser,
  ]).map(a => a.join("")),
]);

/*
WordKa
    WordKaHyphen
    WordKaSmall
*/
export const wordKaParser = choice([
  wordKaHyphenParser,
  wordKaSmallParser
]);

/*
Word
    WordDe
    WordKa
*/
const wordParser = choice([
  wordDeParser,
  wordKaParser,
]);

/*
Words
    Word (ws Word)*
*/
export const wordsParser = (sepBy1( whitespaceParser) (wordParser)).map(a => a.join(" "));
