import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const res = await fetch("https://raw.githubusercontent.com/vwkd/ka-dict-verbs/main/vz/vz.txt");
const inputStr = await res.text();
const input = encoder.encode(inputStr);

function handleError(error, parsingState) {
  console.log("Parse failure");
  
  const indexFailure = parsingState.index;
  
  const inputBefore = input.slice(0, indexFailure);
  const indexFailureCodePoint = decoder.decode(inputBefore).length;
  console.error(error.replace(/\d+/, indexFailureCodePoint));
  
  console.error("Parse target:", parsingState.data);

  return parsingState.result;
}

function handleSuccess(result, _) {
  console.log("Parse end");
  
  return result;
}

const parseResult = parser.fork(input, handleError, handleSuccess);

const result = transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("vz.json", JSON.stringify(result));
