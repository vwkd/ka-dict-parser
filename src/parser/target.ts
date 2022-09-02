import {
  str,
  coroutine,
  choice,
  char,
  sequenceOf,
  possibly,
  many,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";
import tagsParser from "./tags.ts";
import sentenceParser from "./sentence.ts";

/*
CommaWhitespaceSentence
    "," ws Sentence
*/
const commaWhitespaceSentenceParser = coroutine( function* () {
  yield char(",");
  yield whitespaceParser;
  const sentence = yield sentenceParser;
  
  return sentence;
});

/*
// todo: assumes sentences if and only if separated by comma, not yet true ❗️
Sentences
    SentenceDe CommaWhitespaceSentenceDe*
*/
const sentencesParser = coroutine( function* () {
  const sentence = yield sentenceParser;
  const sentences = yield many( commaWhitespaceSentenceParser);
  
  return [
    sentence,
    ...sentences,
  ];
});

/*
Value
    (Tags ws)? Sentences
*/
const valueParser = coroutine( function* () {
  const tags = (yield possibly( sequenceOf([
    tagsParser,
    whitespaceParser
  ]).map(a => a[1]))) ?? [];

  const sentences = yield sentencesParser;
  
  return {
    sentences,
    tags,
  };
});

/*
IntegerDotWhitespaceValue(i)
    i "." ws Value
*/
const integerDotWhitespaceValueParserFactory = position => coroutine( function* () {
  yield char(`${position}`);
  yield char(".");
  yield whitespaceParser;
  const value = yield valueParser;
  
  return {
    position,
    ...value,
  };
});

/*
WhitespaceIntegerDotWhitespaceValue(i)
    ws IntegerDotWhitespaceValue(i)
*/

const whitespaceIntegerDotWhitespaceValueParserFactory = position => coroutine( function* () {
  yield whitespaceParser;
  const value = yield integerDotWhitespaceValueParserFactory(position);
  
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
    position: 1,
    ...value,
  }]),
]);

export default targetParser;