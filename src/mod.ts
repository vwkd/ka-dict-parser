import parser from "./parser/mod.ts"

const input = `ბორძიკ 1. stolpern 2. stammeln`;

parser.fork(input,
  (error, _) => console.error("Error:", error),
  (result, _) => console.log("Success:", result)
);
