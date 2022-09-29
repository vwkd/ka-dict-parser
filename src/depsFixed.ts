import {
  sequenceOf,
  many,
} from "./deps.ts";

export const sepBy1Fixed = separator => value => sequenceOf([
  value,
  many(sequenceOf([
    separator,
    value
  ])),
]);