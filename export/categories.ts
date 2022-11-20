import vz from "../vz.json" assert { type: "json" } ;

console.log("Extracting categories into categories.json");

const uniqueCategories = new Set();

for (const { source, target, id } of vz) {
    //console.log(`Processing ${id}...`);

    for (const { value: tValue, meaning } of target) {
        for (const { value: eValue, tags } of tValue) {
            // skip reference
            if (!eValue) {
                continue;
            }
            for (const { value, category } of eValue) {
                for (const cat of category) {
                    uniqueCategories.add(cat);
                }
            }
        }
    }
}

const categories = Array
    .from(uniqueCategories)
    .sort()
    .map((category, id) => ({ id: id + 1, category }));

await Deno.writeTextFile("categories.json", JSON.stringify(categories, null, 2));