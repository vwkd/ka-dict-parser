import { equal, uuidByString } from "../deps.ts";
import type { EntryType } from "../types.ts";
import { pipe } from "../utils.ts";

// ns:DNS UUID v5 for "kita.ge"
const namespace = "2004eaab-0273-5206-b642-db704a5e506c";

export default function transform(entries: EntryType[]) {
  const p = pipe(
    renameTags,
    sortTags,
    removeOld,
    addId,
    addReferenceId,
    renameReferenceKind,
  );
  
  return p(entries);
}

/* Add entry.id
 * uses source value and meaning as id using UUID v5
*/
function addId(entries: EntryType[]) {

  entries.forEach(e => {
  
    const data = e.source.value + (e.source.meaning ?? "");
    
    const uuid = uuidByString(data, namespace, 5);
    
    // only use first 8 chars
    e.id = uuid.split("-")[0];
  });
  
  return entries;
}

/* Add reference id
 * beware: assumes entries have unique source, no duplicates!
*/
function addReferenceId(entries: EntryType[]) {

  entries.forEach(e => {
    e.target.forEach(({ value }) => {
      value.forEach(value => {
        // checks if reference
        if (value.source) {
          const eRef = entries.find(f => equal(f.source, value.source));
          
          if (!eRef) {
            // throw new Error(`Couldn't find referenced entry '${Object.yalues(source).join("^")}' at entry '${Object.yalues(e.source).join("^")}'.`);
          }
          const id = eRef?.id ?? "000";
          
          value.id = id;
        }
      });
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
    e.target.forEach(({ value }) => {
      value.forEach(value => {
        // checks if reference
        if (value.kind) {
          value.kind = KIND[value.kind];
        }
      });
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
      value.forEach(value => {
        value.tags = newTags(value.tags);
      });
    });
  });
  
  return entries;
}

/* Sort tags alphabetically
*/
function sortTags(entries: EntryType[]) {

  entries.forEach(e => {
    e.target.forEach(({ value }) => {
      value.forEach(value => {
        value.tags.sort();
      });
    });
  });
  
  return entries;
}

/* Remove old entries or yalues
 * beware: if numbered may end up with missing number in sequence!
*/
function removeOld(entries: EntryType[]) {
  return entries.map(e => {
  
    e.target = e.target.map(t => {
      t.value = t.value.filter(({ tags }) => !tags.includes("VA"));
        
      if (t.value.length == 0) {
        return null;
      }
    
      return t;
    }).filter(t => t != null);
    
    if (e.target.length == 0) {
      return null;
    }
    
    return e;
  }).filter(e => e != null);
}
