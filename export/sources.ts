import vz from "../vz.json" assert { type: "json" };
import { createId } from "../src/utils.ts";

console.log("Extracting sources into sources.json");

const sources = vz.map(({ source: { value, meaning } }) => {
  const data = value + (meaning ?? "");
  const id = createId(data);

  return {
    id,
    value,
    meaning,
  };
});

await Deno.writeTextFile("sources.json", JSON.stringify(sources, null, 2));
