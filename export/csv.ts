import { stringify } from "$std/encoding/csv.ts";

import tags from "../tags.json" assert { type: "json" } ;
import categories from "../categories.json" assert { type: "json" } ;

const exports = {
    "tags": tags,
    "categories": categories,
}

for (const [name, data] of Object.entries(exports)) {
    console.log(`Exporting ${name}.csv`, name);

    const columns = Object.getOwnPropertyNames(data[0]);

    await Deno.writeTextFile(`${name}.csv`, stringify(data, { columns }));
}