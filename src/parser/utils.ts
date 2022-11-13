import {
  sequenceOf,
  many,
} from "$arcsecond";

// fixed version, see https://github.com/francisrstokes/arcsecond/issues/98
export const sepBy1 = separator => value => sequenceOf([
  value,
  many(sequenceOf([
    separator,
    value
  ]).map(a => a[1])),
]).map(([e, r]) => [e, ...r]);