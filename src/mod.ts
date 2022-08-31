import parser from "./parser/mod.ts"

const input = `ადგილ umstellen, translozieren
ადვილ erleichtern`;

parser.fork(input,
  (error, _) => console.error(error),
  (result, _) => console.log(result)
);
