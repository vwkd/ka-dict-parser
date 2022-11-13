import { choice, coroutine, getData, setData, str, withData } from "$arcsecond";
import { sepBy1 } from "./utils.ts";

import { whitespaceParser } from "./chars.ts";
import fieldParser from "./field.ts";
import referenceParser from "./reference.ts";

/*
Value
    Reference
    Field
*/
const valueParser = choice([
  referenceParser,
  fieldParser,
]);

/*
Definition
    Value (";" ws Value)*
*/
const definitionParser = sepBy1(str("; "))(valueParser);

/*
DefinitionItem(i)
    i "." ws Definition
*/
const definitionItemParser = coroutine((run) => {
  const meaning = run(getData);

  run(str(`${meaning}.`));
  run(whitespaceParser);
  const definition = run(definitionParser);

  run(setData(meaning + 1));

  return {
    value: definition,
    meaning,
  };
});

/*
Definitions
     DefinitionItem(1) ws DefinitionItem(2) (ws DefinitionItem(i))_i=3*
*/
const definitionsParser = withData(coroutine((run) => {
  const definition1 = run(definitionItemParser);
  run(whitespaceParser);
  const definitionRest = run(sepBy1(whitespaceParser)(definitionItemParser));

  return [
    definition1,
    ...definitionRest,
  ];
}));

/*
Target
    Definitions
    Definition
*/
const targetParser = choice([
  definitionsParser(1),
  definitionParser.map((definition) => [{
    value: definition,
  }]),
]);

export default targetParser;
