import {
  char,
} from "../deps.ts";

/*
nl
    UNICODE_NEWLINE_CHARACTER
*/
// todo: maybe use regex(/\n/); ?
export const newlineParser = char(`
`);

/*
ws
    UNICODE_WHITESPACE_CHARACTER
*/
export const whitespaceParser = char(" ");