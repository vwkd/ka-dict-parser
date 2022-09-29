import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";
import { ByteCodePointConverter } from "./utils.ts";
import { inputObj } from "./deps.ts";

function handleError(error, parsingState) {
  console.error("Parse failure:", error.replace(/\d+/, inputObj.getPointIndex(parsingState.index)));
  
  console.error("Parse target:", parsingState.data);

  return parsingState.result;
}

function handleSuccess(result, _) {
  console.log("Parse end");
  
  return result;
}

const parseResult = parser.fork(inputObj.bytes, handleError, handleSuccess);

const result = transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("vz.json", JSON.stringify(result, null, 2));
