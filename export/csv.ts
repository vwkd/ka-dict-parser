import { stringify } from "$std/encoding/csv.ts";

import sources from "../sources.json" assert { type: "json" };
import targets from "../targets.json" assert { type: "json" };
import tags from "../tags.json" assert { type: "json" };
import categories from "../categories.json" assert { type: "json" };

const exports = {
  "sources": sources,
  "targets": targets,
  "tags": tags,
  "categories": categories,
};

for (const [name, data] of Object.entries(exports)) {
  console.log(`Exporting ${name}.csv`);

  const propertyNames = new Set();

  // beware: order not necessarily like object, e.g.
  // optional property not at end
  // multiple optional properties depending on order of entries
  // etc.
  for (const entry of data) {
    const propNames = Object.getOwnPropertyNames(entry);

    for (const propName of propNames) {
      propertyNames.add(propName);
    }
  }

  const columns = Array.from(propertyNames);

  const csv = stringify(data, { columns });

  await Deno.writeTextFile(`${name}.csv`, csv.trim());
}
