import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const res = await fetch("https://raw.githubusercontent.com/vwkd/ka-dict-verbs/main/src/vz.txt");
const inputStr = await res.text();
const input = encoder.encode(inputStr);

let inputAfter = input;

const parseResult = parser.fork(input, handleError, handleSuccess);

function handleError(error, parsingState) {
  console.error("Parse error:", error);
  console.error("Parse target:", parsingState.data);
  
  // if breaks within first line return only part of object without array
  const resultBefore = Array.isArray(parsingState.result) ? parsingState.result : [];
  console.log("Parse result:", resultBefore);
  
  const indexFailure = parsingState.index;
  
  // continue with next line
  const indexContinue = inputAfter.indexOf(10, indexFailure) + 1;
  
  inputAfter = inputAfter.slice(indexContinue);

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
