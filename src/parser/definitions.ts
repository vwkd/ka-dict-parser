import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
  sequenceOf,
  possibly,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import tagsParser from "./tags.ts";

/*
Definitions
    DefinitionList
    Definition
*/
const definitionsParser = recursiveParser( () => choice([
  definitionsListParser,
  definitionParser.map(definition => [{
    position: 1,
    ...definition,
  }]),
]));

// beware: extended McKeeman Form with regex repetition operator and argument
/*
DefinitionList
    DefinitionListItem(1) WhitespaceAndDefinitionsListItem(2) (WhitespaceAndDefinitionsListItem(i + 3))*i
*/
const definitionsListParser = coroutine( function* () {
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

// beware: extended McKeeman Form with parameter variable `Integer`
/*
WhitespaceAndDefinitionsListItem(Integer)
    ws DefinitionListItem(Integer)
*/

const whitespaceAndDefinitionsListItemParserFactory = position => coroutine( function* () {
  yield whitespaceParser;
  const definitionListItem = yield definitionsListItemParserFactory(position);
  
  return definitionListItem;
});

// beware: extended McKeeman Form with parameter variable `Integer`
/*
DefinitionListItem(Integer)
    Integer "." ws Definition
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
Definition
    Entries
    EntriesTagged
*/
const definitionParser = recursiveParser( () => choice([
  entriesParser.map(entries => ({
    entries,
    tags: [],
  })),
  entriesTaggedParser,
]));

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
// todo: assumes entries if and only if separated by comma, not yet true ❗️
Entries
    EntryList
    Entry
*/
const entriesParser = recursiveParser( () => choice([
  entryListParser,
  entryParser,
]));

/*
EntryList
    Entry "," ws Entries
*/
const entryListParser = coroutine( function* () {
  const entry = yield entryParser;
  yield char(",");
  yield whitespaceParser;
  const entries = yield entriesParser;
  
  return [
    ...entry,
    ...entries,
  ];
});

/*
// todo: not true, might have other WordsKa ❗️
Entry
    WordsDe
*/
const entryParser = recursiveParser( () => wordsDeParser.map(s => [s]));

/*
// todo: assume expanded all shorthands, has no (), od., /, ;, not yet true ❗️
WordsDe
    WordDe "-" WordsDe
    WordDe ws WordsDe
    WordDe
*/
const wordsDeParser = recursiveParser( () => choice([
  sequenceOf([
    wordDeParser,
    char("-"),
    wordsDeParser,
  ]).map(a => a.join("")),
    sequenceOf([
    wordDeParser,
    whitespaceParser,
    wordsDeParser,
  ]).map(a => a.join("")),
  wordDeParser,
]));

/*
// note: require at least two letters
WordDe
    CharDeBig CharsDeSmall
    CharDeSmall CharsDeSmall
*/
const wordDeParser = recursiveParser( () => choice([
  sequenceOf([
    charDeBigParser,
    charsDeSmallParser,
  ]).map(a => a.join("")),
  sequenceOf([
    charDeSmallParser,
    charsDeSmallParser,
  ]).map(a => a.join("")),
]));

/*
CharsDeSmall
    CharDeSmall CharsDeSmall
    CharDeSmall
*/
const charsDeSmallParser = recursiveParser( () => choice([
  sequenceOf([
    charDeSmallParser,
    charsDeSmallParser,
  ]).map(a => a.join("")),
  charDeSmallParser,
]));

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

export default definitionsParser;