import {
  str,
  sequenceOf,
  choice,
  char
} from './deps.ts';

// ---------- Parser ----------

const helloString = str("hello");

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

const runParse = input => fullParser.fork(input,
  (error, _) => console.error(error),
  (result, _) => console.log(result)
);

const input1 = "Hello world";

const result1 = runParse(input1);

const input2 = "Hello cream";

const result2 = runParse(input2);
