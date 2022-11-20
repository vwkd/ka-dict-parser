import vz from "../vz.json" assert { type: "json" };
import { createId } from "../src/utils.ts";
import { sourceId } from "./sources.ts";

export function targetId(targetMeaning, value, meaning) {
  const data = sourceId(value, meaning) + (targetMeaning ?? "0");
  return createId(data);
}

console.log("Extracting targets into targets.json");

const targets = [];

for (const { source: { value, meaning }, target } of vz) {
  //console.log(`Processing ${id}...`);

  for (const { meaning: targetMeaning } of target) {
    const id = targetId(targetMeaning, value, meaning);
    const source = sourceId(value, meaning);
    
    targets.push({
      id,
      meaning,
      source,
    });
  }
}

await Deno.writeTextFile("targets.json", JSON.stringify(targets, null, 2));
