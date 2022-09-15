import {
  coroutine,
  choice,
  char,
  sequenceOf,
  possibly,
  many,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import sentenceParser from "./sentence.ts";
import referenceParser from "./reference.ts";

/*
Value
    Reference
    Sentence
*/
const valueParser = choice([
  referenceParser,
  sentenceParser,
]);

/*
SemicolonWhitespaceValue
    ";" ws Value
*/
const semicolonWhitespaceValueParser = coroutine( function* () {
  yield char(";");
  yield whitespaceParser;
  const value = yield valueParser;
  
  return value;
});

/*
// todo: assumes sentences if and only if separated by comma, not yet true ❗️
Values
    Value SemicolonWhitespaceValue*
*/
const valuesParser = coroutine( function* () {
  const value = yield valueParser;
  const values = yield many( semicolonWhitespaceValueParser);
  
  const vals = [value, ...values];
  
  return {
    value: vals,
  };
});

/*
Definition
    Values
*/
const definitionParser = valuesParser;

/*
IntegerDotWhitespaceDefinition(i)
    i "." ws Definition
*/
const integerDotWhitespaceDefinitionParserFactory = meaning => coroutine( function* () {
  yield char(`${meaning}`);
  yield char(".");
  yield whitespaceParser;
  const definition = yield definitionParser;
  
  return {
    definition,
    meaning,
  };
});

/*
WhitespaceIntegerDotWhitespaceDefinition(i)
    ws IntegerDotWhitespaceDefinition(i)
*/

const whitespaceIntegerDotWhitespaceDefinitionParserFactory = meaning => coroutine( function* () {
  yield whitespaceParser;
  const definition = yield integerDotWhitespaceDefinitionParserFactory(meaning);
  
  return definition;
});

/*
Definitions
    IntegerDotWhitespaceDefinition(1) WhitespaceIntegerDotWhitespaceDefinition_i=2(i + 1)+
*/
const definitionsParser = coroutine( function* () {
  const definition1 = yield integerDotWhitespaceDefinitionParserFactory(1);
  
  const definition2 = yield whitespaceIntegerDotWhitespaceDefinitionParserFactory(2);
  
  const definitions = [definition1, definition2];
  
  for (let i = 3; ; i += 1) {
    const definition = yield possibly( whitespaceIntegerDotWhitespaceDefinitionParserFactory(i));
    
    if (definition === null) {
      break;
    } else {
      definitions.push(definition);
    }
  }
  
  return definitions;
})

/*
Target
    Definitions
    Definition
*/
const targetParser = choice([
  definitionsParser,
  definitionParser.map(definition => [{
    definition,
    meaning: 1,
  }]),
]);

export default targetParser;