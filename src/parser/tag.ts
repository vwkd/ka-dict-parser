import { between, char, choice, coroutine, str } from "$arcsecond";
import { sepBy1 } from "./utils.ts";

import { whitespaceParser } from "./chars.ts";

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
/* Rename tags
* remove trailing period and make uppercase
* note: saves database to keep short and expand only on client, also GraphQL server only allows _a-zA-Z
* note: assumes all tags have trailing period
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
]).map((tag) => tag.slice(0, -1).toUpperCase().replace("-", "_"));

/*
Tags
    "{" Tag ("," ws Tag)* "}"
*/
const tagsParser = between(char("{"))(char("}"))(sepBy1(str(", "))(tagParser));

/*
TagsWhitespace
    Tags ws
*/
const tagsWhitespaceParser = coroutine((run) => {
  const tags = run(tagsParser);
  run(whitespaceParser);

  return tags;
});

export default tagsWhitespaceParser;
