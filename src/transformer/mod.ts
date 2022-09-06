import { deepEquals } from "../deps.ts";
import type { EntryType } from "../parser/types.ts";

function transform(input: EntryType[]) {
  const p = pipe(
    addId,
    addReferenceId,
    renameReferenceKind,
  );
  
  return p(input);
}

// use line number as id
function addId(input: EntryType[]) {
  return input.map((e, i) => {
    e.id = i;￼
    
    return e;
  });
}
// beware: assumes entries have unique source, no duplicates!
function addReferenceId(input: EntryType[]) {
  return input.map(e => {
    const reference = e.reference
    
    if (reference) {
    
      const source = reference.source;
      
      const eReference = input.find(f => equal(f.source, source));
      
      if (!eReference) {
        throw new Error(`Couldn't find referenced entry '${Object.values(source).join("^")}' at entry '${Object.values(e.source).join("^")}'.`);
      }
      
      e.reference.id = eReference.id;
    }
    
    return e;
  });
}

function renameReferenceKind(input: EntryType[]) {
  const KIND = {
    "s.": "SEE",
    "s. Bed.": "MEANING",
    "id.": "IDENTICAL",
  };
  
  return input.map(e => {
    const reference = e.reference
    
    if (reference) {
      const kind = reference.kind;
      reference.kind = KIND[kind];
    }
    
    return e;
  });
}

const pipe = (...fns) => (x) => fns.reduce((res, fn) => fn(res), x);