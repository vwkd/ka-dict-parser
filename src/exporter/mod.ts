import { stringify } from "$std/encoding/csv.ts";

import type {
  CategorizationRow,
  CategoryRow,
  ElementRow,
  EntryType,
  FieldRow,
  FieldType,
  ReferenceRow,
  ReferenceType,
  SourceRow,
  TagizationFieldRow,
  TagizationReferenceRow,
  TagRow,
  TargetRow,
} from "../types.ts";

const sourcesTable: SourceRow[] = [];
const targetsTable: TargetRow[] = [];
const tagsTable: TagRow[] = [];
const tagizationReferenceTable: TagizationReferenceRow[] = [];
const tagizationFieldTable: TagizationFieldRow[] = [];
const referencesTable: ReferenceRow[] = [];
const fieldsTable: FieldRow[] = [];
const elementsTable: ElementRow[] = [];
const categoriesTable: CategoryRow[] = [];
const categorizationTable: CategorizationRow[] = [];

const sourcesTableHeaders: Array<keyof SourceRow> = ["id", "value", "meaning"];
const targetsTableHeaders: Array<keyof TargetRow> = ["id", "source", "meaning"];
const tagsTableHeaders: Array<keyof TagRow> = ["id", "value"];
const tagizationReferenceTableHeaders: Array<keyof TagizationReferenceRow> = ["id", "tag", "reference"];
const tagizationFieldTableHeaders: Array<keyof TagizationFieldRow> = ["id", "tag", "field"];
const referencesTableHeaders: Array<keyof ReferenceRow> = [
  "id",
  "target",
  "source",
  "meaning",
  "kind",
];
const fieldsTableHeaders: Array<keyof FieldRow> = ["id", "target", "index"];
const elementsTableHeaders: Array<keyof ElementRow> = ["id", "field", "index", "value"];
const categoriesTableHeaders: Array<keyof CategoryRow> = ["id", "value"];
const categorizationTableHeaders: Array<keyof CategorizationRow> = ["id", "category", "element"];

const exports = {
  "sourcesTable": { rows: sourcesTable, headers: sourcesTableHeaders },
  "targetsTable": { rows: targetsTable, headers: targetsTableHeaders },
  "tagsTable": { rows: tagsTable, headers: tagsTableHeaders },
  "tagizationReferenceTable": {
    rows: tagizationReferenceTable,
    headers: tagizationReferenceTableHeaders,
  },
  "tagizationFieldTable": {
    rows: tagizationFieldTable,
    headers: tagizationFieldTableHeaders,
  },
  "referencesTable": {
    rows: referencesTable,
    headers: referencesTableHeaders,
  },
  "fieldsTable": { rows: fieldsTable, headers: fieldsTableHeaders },
  "elementsTable": { rows: elementsTable, headers: elementsTableHeaders },
  "categoriesTable": {
    rows: categoriesTable,
    headers: categoriesTableHeaders,
  },
  "categorizationTable": {
    rows: categorizationTable,
    headers: categorizationTableHeaders,
  },
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

      for (const [fieldOrReferenceIndex, fieldOrReference] of target.value.entries()) {
        // reference
        if ((fieldOrReference as ReferenceType).kind) {
          const reference = (fieldOrReference as ReferenceType);
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
            target: targetRow.id,
            source: sourceRowReference.id,
            meaning: reference.meaning,
            kind: reference.kind,
          };
          referencesTable.push(referenceRow);

          for (const tag of reference.tags) {
            let tagRow = tagsTable.find((t) => t.value == tag);
  
            if (!tagRow) {
              tagRow = {
                id: tagsTable.length + 1,
                value: tag,
              };
              tagsTable.push(tagRow);
            }
  
            const tagizationRow = {
              id: tagizationReferenceTable.length + 1,
              tag: tagRow.id,
              reference: referenceRow.id,
            };
            tagizationReferenceTable.push(tagizationRow);
          }
          // field
        } else {
          const field = (fieldOrReference as FieldType);
          // { value, tags }

          const fieldRow = {
            id: fieldsTable.length + 1,
            target: targetRow.id,
            index: fieldOrReferenceIndex + 1,
          };
          fieldsTable.push(fieldRow);

          for (const [elementIndex, element] of field.value.entries()) {
            // { value, category }

            const elementRow = {
              id: elementsTable.length + 1,
              value: element.value,
              field: fieldRow.id,
              index: elementIndex + 1,
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

            for (const tag of field.tags) {
              let tagRow = tagsTable.find((t) => t.value == tag);
    
              if (!tagRow) {
                tagRow = {
                  id: tagsTable.length + 1,
                  value: tag,
                };
                tagsTable.push(tagRow);
              }
    
              const tagizationRow = {
                id: tagizationFieldTable.length + 1,
                tag: tagRow.id,
                field: fieldRow.id,
              };
              tagizationFieldTable.push(tagizationRow);
            }
          }
        }
      }
    }
  }

  for (const [name, {rows, headers}] of Object.entries(exports)) {
    console.log(`Exporting ${name}.csv`);
  
    const csv = stringify(rows, { columns: headers });
  
    await Deno.writeTextFile(`${name}.csv`, csv.trim());
  }

  console.log("Export success");
}
