import {
  str,
  coroutine,
  choice,
  char,
  sequenceOf,
  possibly,
  many,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import tagsParser from "./tags.ts";
import wordsDeParser from "./words.ts";
  
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
  yield whitespaceParser;
  yield char(",");
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

/*
Definitions
    DefinitionList
    Definition
*/
const definitionsParser = choice([
  definitionsListParser,
  definitionParser.map(definition => [{
    position: 1,
    ...definition,
  }]),
]);

export default definitionsParser;