import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const input = await Deno.readTextFile("./vz.txt");

const parseResult = parser.fork(input,
  (error, parsingState) => {
    console.error("Parse error:", error);
    console.error("Parse target:", parsingState.data);
    // throw error;
    return parsingState.result
  },
  (result, _) => {
    console.log("Parse success");
    return result;
  }
);

const result = parseResult; //transformer(parseResult);
console.log("Transform success");

await Deno.writeTextFile("out/vz.json", JSON.stringify(result, null, 2));
