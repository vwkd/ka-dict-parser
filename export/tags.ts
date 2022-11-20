import vz from "../vz.json" assert { type: "json" };

console.log("Extracting tags into tags.json");

const uniqueCategories = new Set();

for (const { source, target, id } of vz) {
  //console.log(`Processing ${id}...`);

  for (const { value: tValue, meaning } of target) {
    for (const { value: eValue, tags } of tValue) {
      for (const tag of tags) {
        uniqueCategories.add(tag);
      }
    }
  }
}

const tags = Array
  .from(uniqueCategories)
  .sort()
  .map((tag, id) => ({ id: id + 1, tag }));

await Deno.writeTextFile("tags.json", JSON.stringify(tags, null, 2));
