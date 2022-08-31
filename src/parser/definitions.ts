import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import integerParser from "./integer.ts";
import tagsParser from "./tag.ts";

/*
Definitions
    Definition
    List
*/

/*
// todo: limit list to increasing integers "1. xxx 2. xxx 3. xxx"
List
    ListItem ws List
    ListItem ws ListItem
*/

/*
ListItem
    Integer "." ws Definition
*/

/*
Definition
    Entries
    Tags ws Entries
*/

/*
// todo: assumes entries if and only if separated by comma, not yet true ❗️
Entries
    Entry "," ws Entries
    Entry
*/

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

/*
WordDe
    CharDe WordDe
    CharDe
    CharDe "-" WordDe
*/

/*
CharDe
    UNICODE_GERMAN_CHARACTER
*/

export default definitionsParser;