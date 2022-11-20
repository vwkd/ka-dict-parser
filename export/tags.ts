import { stringify } from "$std/encoding/csv.ts";
import vz from "../vz.json" assert { type: "json" } ;

const tagList = new Set();

for (const { source, target, id } of vz) {
    //console.log(`Processing ${id}...`);

    for (const { value: tValue, meaning } of target) {
        for (const { value: eValue, tags } of tValue) {
            for (const tag of tags) {
                tagList.add(tag);
            }
        }
    }
}

const tags = Array.from(tagList).sort().map((tag, id) => ({ id: id + 1, tag }));

await Deno.writeTextFile("tags.csv", stringify(tags, { columns: [
    "id",
    "tag"
] }));