import vz from "../vz.json" assert { type: "json" };

console.log("Extracting sources into sources.json");

const sources = vz.map(({ source: { value, meaning } }, id) => ({
  id: id + 1,
  value,
  meaning,
}));

await Deno.writeTextFile("sources.json", JSON.stringify(sources, null, 2));
