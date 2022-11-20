import vz from "../vz.json" assert { type: "json" };
import { createId } from "../src/utils.ts";
import { sourceId } from "./sources.ts";
import { targetId } from "./targets.ts";

export function referenceId(referenceValue, referenceMeaning, kind, targetMeaning, value, meaning) {
  const data = targetId(targetMeaning, value, meaning) + sourceId(referenceValue, referenceMeaning) + kind;
  return createId(data);
}

console.log("Extracting references into references.json");

const references = [];

for (const { source: { value, meaning }, target } of vz) {
  //console.log(`Processing ${id}...`);

  for (const { value: targetValue, meaning: targetMeaning } of target) {

    for (const { source, kind } of targetValue) {

      // skip if not reference
      if (!kind) {
        continue;
      }

      const { value: referenceValue, meaning: referenceMeaning } = source;

      const id = referenceId(referenceValue, referenceMeaning, kind, targetMeaning, value, meaning);
      const target = targetId(targetMeaning, value, meaning);

      references.push({
        id,
        target,
        kind,
      });
    }
  }
}

await Deno.writeTextFile("references.json", JSON.stringify(references, null, 2));
