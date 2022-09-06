import { equal } from "../deps.ts";
import type { EntryType } from "../types.ts";

export default function transform(entries: EntryType[]) {
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
  return entries.map((e, id) => ({ id, ...e,}));
}

/* Add entry.reference?.id
 * beware: assumes entries have unique source, no duplicates!
*/
function addReferenceId(entries: EntryType[]) {
  return entries.map(e => {
    const reference = e.reference
    
    if (reference) {
    
      const source = reference.source;
      
      const eRef = entries.find(f => equal(f.source, source));
      
      if (!eRef) {
        throw new Error(`Couldn't find referenced entry '${Object.values(source).join("^")}' at entry '${Object.values(e.source).join("^")}'.`);
      }
      
      const id = eRef.id;
      e.reference = {
        id,
        ...e.reference,
      };
    }
    
    return e;
  });
}

/* Rename reference kind
* expand word and make uppercase
*/
function renameReferenceKind(entries: EntryType[]) {
  const KIND = {
    "s.": "DIRECT",
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
* note: assumes all tags have trailing period
*/
function renameTags(entries: EntryType[]) {
  function newTags(tags) {
    return tags.map(t => t.slice(0, -1).toUpperCase());
  }

  return entries.map(e => {
    if (e.target) {
      e.target.forEach(target => {
        const tags = target.tags;
        target.tags = newTags(tags);
      });
    } else {
      const tags = e.reference.tags;
      e.reference.tags = newTags(tags);
    } 
    
    return e;
  });
}

const pipe = (...fns) => (x) => fns.reduce((res, fn) => fn(res), x);