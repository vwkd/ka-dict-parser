import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const res = await fetch("https://raw.githubusercontent.com/vwkd/ka-dict-verbs/main/vz/vz.txt");
const inputStr = await res.text();
const input = encoder.encode(inputStr);

let inputAfter = input;

const parseResult = parser.fork(input, handleError, handleSuccess);

function handleError(error, parsingState) {
  // TODO: first error is on newline before problematic line due to trying to bail out into endOfInput
  
  console.error("Parse error:", error);
  console.error("Parse target:", parsingState.data);
  
  // if breaks within first line return only part of object without array
  const resultBefore = Array.isArray(parsingState.result) ? parsingState.result : [];
  console.log("Parse result:", resultBefore);
  
  const indexFailure = parsingState.index;
  
  // beware: doesn't work when indexFailure is exactly on newline
  const indexNewlineBefore = inputAfter.lastIndexOf(10, indexFailure);
  const indexNewlineBeforeBounded = indexNewlineBefore != -1 ? indexNewlineBefore : 0;
  const indexNewlineAfter = inputAfter.indexOf(10, indexFailure);
  const indexNewlineAfterBounded = indexNewlineAfter != -1 ? indexNewlineAfter : Infinity;
  
  // todo: for some reason doesn't need `indexNewlineBeforeBounded + 1`
  const line = inputAfter.slice(indexNewlineBeforeBounded, indexNewlineAfterBounded);
  console.log("Can't parse line:", decoder.decode(line));
  
  // continue with next line
  inputAfter = inputAfter.slice(indexNewlineAfterBounded + 1);

  return [
    ...resultBefore,
    // beware: recursive!
    ...parser.fork(inputAfter, handleError, handleSuccess)
  ];
}

function handleSuccess(result, _) {
  console.log("Parse end");
  
  return result;
}

const result = transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("vz.json", JSON.stringify(result));
