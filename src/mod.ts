import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

const res = await fetch("https://raw.githubusercontent.com/vwkd/ka-dict-verbs/main/src/vz.txt");
const input = await res.text();

const result = parser.fork(input,
  (error, _) => {
    console.error("Parse error:", error);
    throw error;
  },
  (result, _) => {
    console.log("Parse success:", result.slice(0,5));
    const result2 = transformer(result);
    console.log("Transform success:", result2.slice(0, 5));
    return result2;
  }
);

await Deno.writeTextFile("vz.json", JSON.stringify(result));
