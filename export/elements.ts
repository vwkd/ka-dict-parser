import vz from "../vz.json" assert { type: "json" };
import { createId } from "../src/utils.ts";
import { sourceId } from "./sources.ts";
import { targetId } from "./targets.ts";

export function elementId(..., targetMeaning, value, meaning) {
  const data = targetId(targetMeaning, value, meaning) + ...;
  return createId(data);
}

console.log("Extracting elements into elements.json");

const elements = [];

for (const { source: { value, meaning }, target } of vz) {
  //console.log(`Processing ${id}...`);

  for (const { value: targetValue, meaning: targetMeaning } of target) {

    for (const { value: elementValue } of targetValue) {

      // skip if not element
      if (!elementValue) {
        continue;
      }

      const id = elementId(..., targetMeaning, value, meaning);
      const target = targetId(targetMeaning, value, meaning);

      for (const { value } of elementValue) {
        
        elements.push({
          id,
          value,
          target,
        });
      }
    }
  }
}

await Deno.writeTextFile("elements.json", JSON.stringify(elements, null, 2));
