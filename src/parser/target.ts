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
  ]).map(a => a[0]))) ?? [];

  const value = yield sentencesParser;
  
  return {
    value,
    tags,
  };
});

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
    meaning,
    ...value,
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
    meaning: 1,
    ...value,
  }]),
]);

export default targetParser;