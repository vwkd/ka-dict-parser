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
// beware: an error always happens twice, first on the newline before the problematic line because of variable line repetition and endOfInput requirement, then within the first line because the truncated input starts at the problematic line
// beware: recursive!
function handleError(error, parsingState) {
  
  const indexFailure = parsingState.index;
  
  const indexNewlineAfter = inputAfter.indexOf(10, indexFailure);
  
  // error on newline
  if (indexNewlineAfter == indexFailure) {
  
    const resultBefore = parsingState.result;
    
    inputAfter = inputAfter.slice(indexNewlineAfter + 1);
  
    return [
      ...resultBefore,
      ...parse(inputAfter),
    ];
    
  // error within first line
  } else {
    const line = inputAfter.slice(0, indexNewlineAfter);
    console.log("Can't parse line:", decoder.decode(line));
    console.error("Parse error:", error);
    console.error("Parse target:", parsingState.data);
    
    inputAfter = inputAfter.slice(indexNewlineAfter + 1);
    
    // note: don't use resultBefore since might be partial object if error doesn't happen to be at end of line
    return parse(inputAfter);
  }
}

function handleSuccess(result, _) {
  console.log("Parse end");
  
  return result;
}

const parseResult = parse(input);

const result = transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("vz.json", JSON.stringify(result));
