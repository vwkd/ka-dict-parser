import parser from "./parser/mod.ts";
import exporter from "./exporter/mod.ts";
import { inputObj } from "./input.ts";

function handleError(error, parsingState) {
  console.error(
    "Parse failure:",
    error.replace(
      /(?<=position )\d+/,
      inputObj.getPointIndex(parsingState.index),
    ),
  );

  console.error("Parse target:", parsingState.data);

  return parsingState.result;
}

function handleSuccess(result, _) {
  console.log("Parse end");

  return result;
}

const result = parser.fork(inputObj.bytes, handleError, handleSuccess);

await exporter(result);
