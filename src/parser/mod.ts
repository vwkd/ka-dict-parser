import {
  str,
  coroutine,
  choice,
  char,
  many,
  recursiveParser,
  anyCharExcept
} from '../deps.ts';

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

export default textParser;