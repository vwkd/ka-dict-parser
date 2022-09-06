import { equal } from "../deps.ts";
import type { EntryType } from "../types.ts";

function transform(entries: EntryType[]) {
  const p = pipe(
    addId,
    addReferenceId,
    renameReferenceKind,
    renameTags,
  );
  
  return p(entries);
}

/* Add entry.id
 * uses line number as id (position in entries array)
*/
function addId(entries: EntryType[]) {
  return entries.map((e, i) => {
    e.id = i;
    
    return e;
  });
}

/* Add entry.reference?.id
 * beware: assumes entries have unique source, no duplicates!
*/
function addReferenceId(entries: EntryType[]) {
  return entries.map(e => {
    const reference = e.reference
    
    if (reference) {
    
      const source = reference.source;
      
      const eReference = entries.find(f => equal(f.source, source));
      
      if (!eReference) {
        throw new Error(`Couldn't find referenced entry '${Object.values(source).join("^")}' at entry '${Object.values(e.source).join("^")}'.`);
      }
      
      e.reference.id = eReference.id;
    }
    
    return e;
  });
}

/* Rename reference kind
* expand word and make uppercase
*/
function renameReferenceKind(entries: EntryType[]) {
  const KIND = {
    "s.": "SEE",
    "s. Bed.": "MEANING",
    "id.": "IDENTICAL",
  };
  
  return entries.map(e => {
    const reference = e.reference
    
    if (reference) {
      const kind = reference.kind;
      reference.kind = KIND[kind];
    }
    
    return e;
  });
}

/* Rename tags
* remove trailing period and make uppercase
*/
function renameTags(entries: EntryType[]) {
  return entries.map(e => {
    const content = e.target ?? e.reference;
    const tags = content.tags;
    
    content.tags = tags.map(t => {
      return tag.slice(0, -1).toUpperCase();
    });
    
    return e;
  });
}

const pipe = (...fns) => (x) => fns.reduce((res, fn) => fn(res), x);