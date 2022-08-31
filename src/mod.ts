import {
  str,
  coroutine,
  choice,
  char
} from './deps.ts';

// ---------- Parser ----------

const fullParser = coroutine(function* () {
  const helloString = yield str("Hello");
  
  const spaceChar = yield char(" ");
  
  const nameString = yield choice([
    str("there"),
    str("everyone"),
    str("world"),
  ]);
});

// ---------- Execution ----------

const runParse = input => fullParser.fork(input,
  (error, _) => console.error(error),
  (result, _) => console.log(result)
);

const input1 = "Hello world";

const result1 = runParse(input1);

const input2 = "Hello cream";

const result2 = runParse(input2);
