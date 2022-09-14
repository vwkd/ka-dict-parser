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
Definition
    Reference
    Sentence
*/
const definitionParser = choice([
  referenceParser,
  sentenceParser,
]);

/*
SemicolonWhitespaceDefinition
    ";" ws Definition
*/
const semicolonWhitespaceDefinitionParser = coroutine( function* () {
  yield char(";");
  yield whitespaceParser;
  const definition = yield definitionParser;
  
  return definition;
});

/*
// todo: assumes sentences if and only if separated by comma, not yet true ❗️
Definitions
    Definition SemicolonWhitespaceDefinition*
*/
const definitionsParser = coroutine( function* () {
  const definition = yield definitionParser;
  const definitions = yield many( semicolonWhitespaceDefinitionParser);
  
  const value = [definition, ...definitions];
  
  return {
    value,
  };
});

/*
Value
    Definitions
*/
const valueParser = definitionsParser;

/*
IntegerDotWhitespaceValue(i)
    i "." ws Value
*/
const integerDotWhitespaceValueParserFactory = meaning => coroutine( function* () {
  yield char(`${meaning}`);
  yield char(".");
  yield whitespaceParser;
  const value = yield valueParser;
  
  return {
    value,
    meaning,
  };
});

/*
WhitespaceIntegerDotWhitespaceValue(i)
    ws IntegerDotWhitespaceValue(i)
*/

const whitespaceIntegerDotWhitespaceValueParserFactory = meaning => coroutine( function* () {
  yield whitespaceParser;
  const value = yield integerDotWhitespaceValueParserFactory(meaning);
  
  return value;
});

/*
Values
    IntegerDotWhitespaceValue(1) WhitespaceIntegerDotWhitespaceValue_i=2(i + 1)+
*/
const valuesParser = coroutine( function* () {
  const value1 = yield integerDotWhitespaceValueParserFactory(1);
  
  const value2 = yield whitespaceIntegerDotWhitespaceValueParserFactory(2);
  
  const values = [value1, value2];
  
  for (let i = 3; ; i += 1) {
    const value = yield possibly( whitespaceIntegerDotWhitespaceValueParserFactory(i));
    
    if (value === null) {
      break;
    } else {
      values.push(value);
    }
  }
  
  return values;
})

/*
Target
    Values
    Value
*/
const targetParser = choice([
  valuesParser,
  valueParser.map(value => [{
    value,
    meaning: 1,
  }]),
]);

export default targetParser;