import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import tagsParser from "./tag.ts";

/*
Definitions
    DefinitionList
    Definition
*/
const definitionsParser = choice([
  definitionsListParser,
  definitionParser,
]);

// beware: extended McKeeman Form with regex repetition operator and argument
/*
DefinitionList
    DefinitionListItem(1) ws DefinitionListItem(2) (ws DefinitionListItem(i+3))*i
*/
const definitionsListParser = coroutine( function* () {
  const res = [];

  res.push(yield definitionsListItemParserFactory(1));
  
  res.push(yield definitionsListItemParserFactory(2));
  
  for (let i = 3; i += 1) {
    const maybe = yield definitionsListItemParserFactory(i);
    
    if (maybe.isError) {
      break;
    } else {
      res.push(maybe);
    }
  }
  
  return res;
})

// beware: extended McKeeman Form with parameter variable `Integer`
/*
DefinitionListItem(Integer)
    Integer "." ws Definition
*/
const definitionsListItemParserFactory = position => coroutine( function* () {
  const _ = yield char(position);
  yield char(".");
  yield whitespaceParser;
  const definition = yield definitionParser;
  
  return {
    position;
    definition;
});

/*
Definition
    Entries
    EntriesTagged
*/

/*
EntriesTagged
    Tags ws Entries
*/

/*
// todo: assumes entries if and only if separated by comma, not yet true ❗️
Entries
    Entry "," ws Entries
    Entry
*/
// use recursiveParser, because of Entries

/*
// todo: not true, might have other WordsKa ❗️
Entry
    WordsDe
*/

/*
// todo: assume expanded all shorthands, has no (), od., /, ;, not yet true ❗️
WordsDe
    WordDe ws WordsDe
    WordDe
*/
// use recursiveParser, because of WordsDe

/*
WordDe
    CharDe WordDe
    CharDe
    CharDe "-" WordDe
*/
// use recursiveParser, because of WordDe

/*
CharDe
    UNICODE_GERMAN_CHARACTER
*/

export default definitionsParser;