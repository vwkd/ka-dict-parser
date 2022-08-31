import parser from "./parser/mod.ts"

const input = `ადგილ umstellen, translozieren
ადვილ erleichtern
ავ böse sein
ავად s. ავადმყოფ
ავყია id. ავყიავ
არ² s. ყოფნ
ასპარეზ {va.} wettkämpfen
ახლ³ s. ხლ³
ბალთ {kach., psch.} zerstückeln
ბორძიკ 1. stolpern 2. stammeln
ბუ² 1. {kach.} aufschütteln 2. {kach.} anschwellen
`;

parser.fork(input,
  (error, _) => console.error(error),
  (result, _) => console.log(result)
);
