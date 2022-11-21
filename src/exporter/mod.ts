import { stringify } from "$std/encoding/csv.ts";

import type {
  CategorizationRow,
  CategoryRow,
  ElementRow,
  EntryType,
  FieldType,
  ReferenceRow,
  ReferenceType,
  SourceRow,
  TagizationRow,
  TagRow,
  TargetRow,
} from "../types.ts";

const sourcesTable: SourceRow[] = [];
const targetsTable: TargetRow[] = [];
const tagsTable: TagRow[] = [];
const tagizationTable: TagizationRow[] = [];
const referencesTable: ReferenceRow[] = [];
const elementsTable: ElementRow[] = [];
const categoriesTable: CategoryRow[] = [];
const categorizationTable: CategorizationRow[] = [];

const exports = {
  "sourcesTable": sourcesTable,
  "targetsTable": targetsTable,
  "tagsTable": tagsTable,
  "tagizationTable": tagizationTable,
  "referencesTable": referencesTable,
  "elementsTable": elementsTable,
  "categoriesTable": categoriesTable,
  "categorizationTable": categorizationTable,
};

export default async function exporter(entries: EntryType[]) {
  // populate sourcesTable in advance for references
  for (const entry of entries) {
    const sourceRow = {
      id: sourcesTable.length + 1,
      value: entry.source.value,
      meaning: entry.source.meaning,
    };
    sourcesTable.push(sourceRow);
  }

  for (const entry of entries) {
    // { source, target }
    // source.value, source.meaning?

    const sourceRow = sourcesTable.find((s) =>
      s.value == entry.source.value && s.meaning == entry.source.meaning
    )!;

    for (const target of entry.target) {
      // { value, meaning? }

      const targetRow = {
        id: targetsTable.length + 1,
        meaning: target.meaning,
        source: sourceRow.id,
      };
      targetsTable.push(targetRow);

      for (const [definitionIndex, definition] of target.value.entries()) {

        // reference
        if ((definition as ReferenceType).kind) {
          const reference = (definition as ReferenceType);
          // { source, meaning, kind, tags }

          const sourceRowReference = sourcesTable.find((s) =>
            s.value == reference.source.value &&
            s.meaning == reference.source.meaning
          );

          if (!sourceRowReference) {
            throw new Error(
              `Couldn't find referenced entry '${
                Object.values(reference.source).join("^")
              }' at entry '${Object.values(entry.source).join("^")}'.`,
            );
          }

          const referenceRow = {
            id: referencesTable.length + 1,
            source: sourceRowReference.id,
            meaning: reference.meaning,
            kind: reference.kind,
            target: targetRow.id,
            definitionIndex: definitionIndex + 1,
          };
          referencesTable.push(referenceRow);

          // field
        } else {
          const field = (definition as FieldType);
          // { value, tags }

          for (const [elementIndex, element] of field.value.entries()) {
            // { value, category }

            const elementRow = {
              id: elementsTable.length + 1,
              value: element.value,
              target: targetRow.id,
              definitionIndex: definitionIndex + 1,
              elementIndex: elementIndex + 1,
            };
            elementsTable.push(elementRow);

            for (const category of element.category) {
              let categoryRow = categoriesTable.find(
                (c) => c.value == category,
              );

              if (!categoryRow) {
                categoryRow = {
                  id: categoriesTable.length + 1,
                  value: category,
                };
                categoriesTable.push(categoryRow);
              }

              const categorizationRow = {
                id: categorizationTable.length + 1,
                category: categoryRow.id,
                element: elementRow.id,
              };
              categorizationTable.push(categorizationRow);
            }
          }
        }

        for (const tag of definition.tags) {
          let tagRow = tagsTable.find((t) => t.value == tag);

          if (!tagRow) {
            tagRow = {
              id: tagsTable.length + 1,
              value: tag,
            };
            tagsTable.push(tagRow);
          }

          const tagizationRow = {
            id: tagizationTable.length + 1,
            tag: tagRow.id,
            target: targetRow.id,
          };
          tagizationTable.push(tagizationRow);
        }
      }
    }
  }

  for (const [name, data] of Object.entries(exports)) {
    console.log(`Exporting ${name}.csv`);
  
    const propertyNames = new Set();
  
    // beware: order not necessarily like object, e.g.
    // optional property not at end
    // multiple optional properties depending on order of entries
    // etc.
    for (const entry of data) {
      const propNames = Object.getOwnPropertyNames(entry);
  
      for (const propName of propNames) {
        propertyNames.add(propName);
      }
    }
  
    const columns = Array.from(propertyNames);
  
    const csv = stringify(data, { columns });
  
    await Deno.writeTextFile(`${name}.csv`, csv.trim());
  }

  console.log("Export success");
}
