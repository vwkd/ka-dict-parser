import {
  str,
  coroutine,
  choice,
  char,
  recursiveParser,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import keyParser from "./key.ts";
import tagsParser from "./tag.ts";

/*
Reference
    ReferenceDirect
    ReferenceMeaning
    ReferenceIdentical
*/

/*
ReferenceDirect
    "s." ws Key
    Tags ws "s." ws Key
*/

/*
ReferenceMeaning
    "s." ws Bed. ws Key
    Tags ws "s." ws Bed. ws Key
*/

/*
ReferenceIdentical
    "id." ws Key
    Tags ws "id." ws Key
*/

export default referenceParser;