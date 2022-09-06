import parser from "./parser/mod.ts"
import transformer from "./transformer/mod.ts";

// const input = await Deno.readTextFile("");

const input = `ადგილ umstellen, translozieren
ადვილ erleichtern
ავ böse sein
ასპარეზ {va.} wettkämpfen
ბალთ {kach., psch.} zerstückeln
ბორძიკ 1. stolpern 2. stammeln
ბუ² 1. {kach.} aufschütteln 2. {kach.} anschwellen
გებულ 1. verstehen 2. vernehmen 3. gewinnen
გონ 1. vernehmen, hören 2. gedenken, sich erinnern 3. ersinnen, erfinden 4. vortäuschen 5. meinen, glauben
ავდარ s. ავდრ
ავდრ schlechtes Wetter sein
ასკინკილა id. ასკინკილავ
ასკინკილავ auf einem Bein hüpfen
ენამზე Bed. s. ენამჭევრ
ენამჭევრ redegewandt sein
ლაქავ beflecken, beklecksen
ლაქიან Bed. s. ლაქავ`;

const result = parser.fork(input,
  (error, _) => {
    console.error("Parse error:", error);
    throw error;
  },
  (result, _) => {
    console.log("Parse success:", result.slice(0,5));
    const result2 = transformer(result);
    console.log("Transform success:", result2.slice(0, 5));
    return result2;
  }
);

await Deno.writeTextFile("out/vz.json", JSON.stringify(result, null, 2));
