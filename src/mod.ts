import {
  str,
  sequenceOf,
  choice,
  char
} from './deps.ts';

// ---------- Parser ----------

const helloString = str("Hello");

const spaceChar = char(" ");

const nameString = choice([
  str("there"),
  str("everyone"),
  str("world"),
]);

const fullParser = sequenceOf([
  helloString,
  spaceChar,
  nameString,
]);

// ---------- Execution ----------

const input = "Hello world";

const result = fullParser.run(input).result;
