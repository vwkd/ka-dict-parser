import {
  str,
  coroutine,
  choice,
  char,
  many,
  recursiveParser,
  everyCharUntil
} from './deps.ts';

// ---------- Parser ----------

/*
Text
    Line
    Line n Text
*/
const textParser = recursiveParser( () => choice([
  lineParser,
  multilineParser,
]));

const multilineParser = coroutine(function* () {
  const line = yield lineParser;
  yield newlineChar;
  return line;
});

const lineParser = coroutine(function* () {
  // TODO: finish
  const line = yield everyCharUntil(newlineChar);
  return line;
});

const newlineChar = char(`
`); // regex(/\n/);

// ---------- Execution ----------

const input = `ადგილ umstellen, translozieren
ადვილ erleichtern`;

textParser.fork(input,
  (error, _) => console.error(error),
  (result, _) => console.log(result)
);
