import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const res = await fetch("https://raw.githubusercontent.com/vwkd/ka-dict-verbs/main/vz/vz.txt");
const inputStr = await res.text();
const input = encoder.encode(inputStr);

let inputAfter = input;

function parse(data) {
  return parser.fork(data, handleError, handleSuccess);
}

// recover from error, continue with next line
// beware: recursive!
// todo: what if error is on newline? then `indexNewlineBefore == indexNewlineAfter == indexFailure`
function handleError(error, parsingState) {
  
  const indexFailure = parsingState.index;
  
  // beware: if error in first line, then indexNewlineBefore is -1, don't change to 0, because `indexNewlineBefore + 1` luckily happens to then compute to 0 already
  const indexNewlineBefore = inputAfter.lastIndexOf(10, indexFailure);
  // beware: if error in last line, then indexNewlineAfter is -1, change to Infinity
  const indexNewlineAfterMaybe = inputAfter.indexOf(10, indexFailure);
  const indexNewlineAfter = indexNewlineAfterMaybe == -1 ? Infinity : indexNewlineAfterMaybe;
  
  const line = inputAfter.slice(indexNewlineBefore + 1, indexNewlineAfter);
  console.log("Can't parse line:", decoder.decode(line));
  
  const inputBefore = inputAfter.slice(0, indexFailure);
  const indexFailureCodePoint = decoder.decode(inputBefore).length;
  console.error(error.replace(/\d+/, indexFailureCodePoint));
  
  console.error("Parse target:", parsingState.data);
  
  // cut out current line result because possibly incomplete
  // note: if error in first line has only partial object without array
  const resultBefore = parsingState.result?.slice(0, -1) ?? [];
  
  inputAfter = inputAfter.slice(indexNewlineAfter + 1);

  return [
    ...resultBefore,
    ...parse(inputAfter),
  ];
}

function handleSuccess(result, _) {
  console.log("Parse end");
  
  return result;
}

const parseResult = parse(input);

const result = transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("vz.json", JSON.stringify(result));
