import { str } from "./deps.ts";

const parser = str("აბ");

parser.fork("აბ", handleError, handleSuccess);
parser.fork("ბბ", handleError, handleSuccess);

function handleError(error, parsingState) {
  console.error("Parse error:", parsingState);
}

function handleSuccess(result, _) {
  console.log("Parse success:", result);
}
