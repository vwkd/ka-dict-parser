import vz from "../vz.json" assert { type: "json" };
import { createId } from "../src/utils.ts";

console.log("Extracting targets into targets.json");

const targets = [];

for (const { id: source, target } of vz) {
  //console.log(`Processing ${id}...`);

  for (const { meaning } of target) {
    const data = source + (meaning ?? "0");
    const id = createId(data);
    
    targets.push({
      id,
      meaning,
      source,
    });
  }
};

await Deno.writeTextFile("targets.json", JSON.stringify(targets, null, 2));
