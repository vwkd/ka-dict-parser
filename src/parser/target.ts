import {
  coroutine,
  choice,
  char,
  sequenceOf,
  possibly,
  sepBy1,
  str,
  getData,
  setData,
  withData,
} from "../deps.ts";

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
const definitionParser = sepBy1( str("; ")) (valueParser);

/*
DefinitionItem(i)
    i "." ws Definition
*/
const definitionItemParser = coroutine( function* () {
  const meaning = yield getData;
  
  yield str(`${meaning}.`);
  yield whitespaceParser;
  const definition = yield definitionParser;
  
  yield setData(meaning + 1);
  
  return {
    value: definition,
    meaning,
  };
});

/*
Definitions
     DefinitionItem(1) ws DefinitionItem(2) (ws DefinitionItem(i))_i=3*
*/
const definitionsParser = withData(coroutine( function* () {
  const definition1 = yield definitionItemParser;
  yield whitespaceParser;
  const definitionRest = yield sepBy1( whitespaceParser) (definitionItemParser);
  
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
  definitionParser.map(definition => [{
    value: definition,
  }]),
]);

export default targetParser;