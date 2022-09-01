import parser from "./parser/mod.ts"

const input = `ადგილ umstellen
`;

parser.fork(input,
  (error, _) => console.error("Error:", error),
  (result, _) => console.log("Success:", result)
);
