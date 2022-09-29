import {
  str,
  coroutine,
  choice,
  char,
  sepBy1,
} from "../deps.ts";

import { whitespaceParser } from "./chars.ts";

/*
TagsWhitespace
    Tags ws
*/
const tagsWhitespaceParser = coroutine( function* () {
  const tags = yield tagsParser;
  yield whitespaceParser;
  
  return tags;
});

/*
Tags
    "{" Tag ("," ws Tag)* "}"
*/
const tagsParser = coroutine( function* () {
  yield char("{");
  const tags = yield sepBy1( str(", ")) (tagParser);
  yield char("}");
  
  return tags;
});

/*
Tag
    "biol."
    "bot."
    "chem."
    "chew."
    "desp."
    "elektr."
    "ethn."
    "fig."
    "gr."
    "gur."
    "hist."
    "HV."
    "imer."
    "ing."
    "iro."
    "jur."
    "kach."
    "khar."
    "khis."
    "landw."
    "letsch."
    "math."
    "med."
    "mil."
    "moch."
    "moral."
    "mthiul."
    "mus."
    "neg."
    "nz."
    "o-imer."
    "photogr."
    "phys."
    "poet."
    "pol."
    "psch."
    "ratsch."
    "rl."
    "spo."
    "tech."
    "thusch."
    "typ."
    "u-imer."
    "u-ratsch."
    "umg."
    "unk."
    "va."
    "vulg."
*/
const tagParser = choice([
  str("biol."),
  str("bot."),
  str("chem."),
  str("chew."),
  str("desp."),
  str("elektr."),
  str("ethn."),
  str("fig."),
  str("gr."),
  str("gur."),
  str("hist."),
  str("HV."),
  str("imer."),
  str("ing."),
  str("iro."),
  str("jur."),
  str("kach."),
  str("khar."),
  str("khis."),
  str("landw."),
  str("letsch."),
  str("math."),
  str("med."),
  str("mil."),
  str("moch."),
  str("moral."),
  str("mthiul."),
  str("mus."),
  str("neg."),
  str("nz."),
  str("o-imer."),
  str("photogr."),
  str("phys."),
  str("poet."),
  str("pol."),
  str("psch."),
  str("ratsch."),
  str("rl."),
  str("spo."),
  str("tech."),
  str("thusch."),
  str("typ."),
  str("u-imer."),
  str("u-ratsch."),
  str("umg."),
  str("unk."),
  str("va."),
  str("vulg."),
]);

export default tagsWhitespaceParser;