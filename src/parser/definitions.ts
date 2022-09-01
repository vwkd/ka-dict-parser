import {
  str,
  coroutine,
  choice,
  char,
  sequenceOf,
  possibly,
  many,
  many1,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import tagsParser from "./tags.ts";

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
// todo: assume expanded all shorthands, has no (), od., /, ;, not yet true ❗️
// note: allow only single hyphen in word, note: in grammar is two words
WordsDe
    WordDe "-" WordDe
    WordDe+
*/
const wordsDeParser = choice([
  sequenceOf([
    wordDeParser,
    char("-"),
    wordDeParser,
  ]),
  many1( wordDeParser),
]).map(a => a.join(""));

/*
// todo: not true, might have other WordsKa ❗️
Entry
    WordsDe
*/
const entryParser = wordsDeParser;

/*
CommaWhitespaceEntry
    "," ws Entry
*/
const commaWhitespaceEntryParser = coroutine( function* () {
  yield char(",");
  yield whitespaceParser;
  const entry = yield entryParser;
  
  return entry;
});

/*
// todo: assumes entries if and only if separated by comma, not yet true ❗️
Entries
    Entry CommaWhitespaceEntry*
*/
const entriesParser = coroutine( function* () {
  const entry = yield entryParser;
  const entries = yield many( commaWhitespaceEntryParser);
  
  return [
    entry,
    ...entries,
  ];
});

/*
EntriesTagged
    Tags ws Entries
*/
const entriesTaggedParser = coroutine( function* () {
  const tags = yield tagsParser;
  yield whitespaceParser;
  const entries = yield entriesParser;
  
  return {
    entries,
    tags,
  };
});

/*
Definition
    Entries
    EntriesTagged
*/
const definitionParser = choice([
  entriesParser.map(entries => ({
    entries,
    tags: [],
  })),
  entriesTaggedParser,
]);

/*
DefinitionListItem(i)
    i "." ws Definition
*/
const definitionsListItemParserFactory = position => coroutine( function* () {
  yield str(`${position}.`);
  yield whitespaceParser;
  const definition = yield definitionParser;
  
  return {
    position,
    ...definition,
  };
});

/*
WhitespaceDefinitionListItem(i)
    ws DefinitionListItem(i)
*/

const whitespaceAndDefinitionsListItemParserFactory = position => coroutine( function* () {
  yield whitespaceParser;
  const definitionListItem = yield definitionsListItemParserFactory(position);
  
  return definitionListItem;
});

/*
DefinitionList
    DefinitionListItem(1) WhitespaceDefinitionListItem_i=2(i + 1)+
*/
const definitionListParser = coroutine( function* () {
  const item1 = yield definitionsListItemParserFactory(1);
  
  const item2 = yield whitespaceAndDefinitionsListItemParserFactory(2);
  
  const results = [item1, item2];
  
  for (let i = 3; ; i += 1) {
    const result = yield possibly( whitespaceAndDefinitionsListItemParserFactory(i));
    
    if (result === null) {
      break;
    } else {
      results.push(result);
    }
  }
  
  return results;
})

/*
Definitions
    DefinitionList
    Definition
*/
const definitionsParser = choice([
  definitionListParser,
  definitionParser.map(definition => [{
    position: 1,
    ...definition,
  }]),
]);

export default definitionsParser;