import { equal } from "../deps.ts";
import type { EntryType } from "../types.ts";

export default function transform(entries: EntryType[]) {
  const p = pipe(
    addId,
    addReferenceId,
    renameReferenceKind,
    renameTags,
    sortTags,
    removeOld,
  );
  
  return p(entries);
}

/* Add entry.id
 * uses line number as id (position in entries array)
*/
function addId(entries: EntryType[]) {
  return entries.map((e, id) => ({ id, ...e,}));
}

/* Add reference id
 * beware: assumes entries have unique source, no duplicates!
*/
function addReferenceId(entries: EntryType[]) {
  entries.forEach(e => {
    e.target.forEach(target => {
      // checks if reference
      if (target.value.source) {
        const eRef = entries.find(f => equal(f.source, target.value.source));
        
        if (!eRef) {
          throw new Error(`Couldn't find referenced entry '${Object.values(value.source).join("^")}' at entry '${Object.values(e.source).join("^")}'.`);
        }
        const id = eRef.id;
        
        target.value = {
          id,
          ...target.value,
        };
      }
    });
  });
  
  return entries;
}

/* Rename reference kind
* expand word and make uppercase
*/
function renameReferenceKind(entries: EntryType[]) {
  const KIND = {
    "s.": "DIRECT",
    "Bed. s.": "MEANING",
    "id.": "IDENTICAL",
  };
  
  entries.forEach(e => {
    e.target.forEach(target => {
      // checks if reference
      if (target.value.kind) {
        target.value.kind = KIND[target.value.kind];
      }
    });
  });
  
  return entries;
}

/* Rename tags
* remove trailing period and make uppercase
* note: saves database to keep short and expand only on client, also GraphQL server only allows _a-zA-Z
* note: assumes all tags have trailing period
*/
function renameTags(entries: EntryType[]) {
  function newTags(tags) {
    return tags.map(tag => tag.slice(0, -1).toUpperCase().replace("-","_"));
  }

  entries.forEach(e => {
    e.target.forEach(({ value }) => {
      value.tags = newTags(value.tags);
    });
  });
  
  return entries;
}

/* Sort tags alphabetically
*/
function sortTags(entries: EntryType[]) {

  entries.forEach(e => {
    e.target.forEach(({ value }) => {
      value.tags.sort();
    });
  });
  
  return entries;
}

/* Remove old entries or values
 * beware: if numbered may end up with missing number in sequence!
*/
function removeOld(entries: EntryType[]) {
  return entries.map(e => {
  
    e.target = e.target.filter(({ value }) => !value.tags.includes("VA"));
    
    if (e.target.length == 0) {
      return null;
    }
    
    return e;
  }).filter(e => e != null);
}

const pipe = (...fns) => (x) => fns.reduce((res, fn) => fn(res), x);