import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const res = await fetch("https://raw.githubusercontent.com/vwkd/ka-dict-verbs/main/vz/vz.txt");
const input = await res.text();

const parseResult = parser.fork(input,
  (error, parsingState) => {
    console.error("Parse error:", error);
    console.error("Parse target:", parsingState.data);
    console.log(parsingState.result.at(-1));
    // throw error;
    return parsingState.result
  },
  (result, _) => {
    console.log("Parse success");
    return result;
  }
);

const result = transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("vz.json", JSON.stringify(result, null, 2));
