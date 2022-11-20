import vz from "../vz.json" assert { type: "json" };
import { createId } from "../src/utils.ts";

export function sourceId(value, meaning) {
  const data = value + (meaning ?? "");
  return createId(data);
}

console.log("Extracting sources into sources.json");

const sources = vz.map(({ source: { value, meaning } }) => {
  const id = sourceId(value, meaning);

  return {
    id,
    value,
    meaning,
  };
});

await Deno.writeTextFile("sources.json", JSON.stringify(sources, null, 2));
