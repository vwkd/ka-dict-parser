import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const res = await fetch("https://raw.githubusercontent.com/vwkd/ka-dict-verbs/main/vz/vz.txt");
const input = await res.text();

let inputRest = input;

const parseResult = parser.fork(input, handleError, handleSuccess);

function handleError(error, parsingState) {
  console.error("Parse error:", error);
  console.error("Parse target:", parsingState.data);
  
  // if breaks within first line return only part of object without array
  const resultBefore = Array.isArray(parsingState.result) ? parsingState.result : [];
  console.log("Parse result:", resultBefore);
  
  const indexFailure = parsingState.index;
  
  // continue with next line
  const indexContinue = inputRest.indexOf("\n", indexFailure) + 1;
  
  inputRest = inputRest.slice(indexContinue);

  return [
    ...resultBefore,
    // beware: recursive!
    ...parser.fork(inputRest, handleError, handleSuccess)
  ];
}

function handleSuccess(result, _) {
  console.log("Parse end");
  
  return result;
}

const result = transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("vz.json", JSON.stringify(result, null, 2));
