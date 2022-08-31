import {
  str,
  coroutine,
  choice,
  char,
  many,
  recursiveParser,
  anyCharExcept
} from './deps.ts';

// ---------- Parser ----------

/*
Text
    Line n Text
    Line
*/
// TODO: use startOfInput and endOfInput?
const textParser = recursiveParser( () => choice([
  multilineParser,
  lineParser,
]));

const multilineParser = coroutine(function* () {
  const line = yield lineParser;
  yield newlineChar;
  const rest = yield textParser;
  const restArr = Array.isArray(rest) ? rest : [rest];
  
  return [
    line,
    ...restArr,
  ];
});

const lineParser = coroutine(function* () {
  // TODO: finish
  const line = yield many (anyCharExcept (newlineChar));
  return line.join("");
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
