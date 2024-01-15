import { stringify } from "$std/encoding/csv.ts";
import { createId } from "./id.ts";

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

const sourceTable: SourceRow[] = [];
const targetTable: TargetRow[] = [];
const tagTable: TagRow[] = [];
const tagizationReferenceTable: TagizationReferenceRow[] = [];
const tagizationFieldTable: TagizationFieldRow[] = [];
const referenceTable: ReferenceRow[] = [];
const fieldTable: FieldRow[] = [];
const elementTable: ElementRow[] = [];
const categoryTable: CategoryRow[] = [];
const categorizationTable: CategorizationRow[] = [];

const sourceTableHeaders: Array<keyof SourceRow> = ["id", "value", "meaning"];
const targetTableHeaders: Array<keyof TargetRow> = [
  "id",
  "source_id",
  "meaning",
];
const tagTableHeaders: Array<keyof TagRow> = ["id", "value"];
const tagizationReferenceTableHeaders: Array<keyof TagizationReferenceRow> = [
  "id",
  "tag_id",
  "reference_id",
  "index",
];
const tagizationFieldTableHeaders: Array<keyof TagizationFieldRow> = [
  "id",
  "tag_id",
  "field_id",
  "index",
];
const referenceTableHeaders: Array<keyof ReferenceRow> = [
  "id",
  "target_id",
  "source_id",
  "meaning",
  "kind",
];
const fieldTableHeaders: Array<keyof FieldRow> = ["id", "target_id", "index"];
const elementTableHeaders: Array<keyof ElementRow> = [
  "id",
  "field_id",
  "index",
  "value",
];
const categoryTableHeaders: Array<keyof CategoryRow> = ["id", "value"];
const categorizationTableHeaders: Array<keyof CategorizationRow> = [
  "id",
  "category_id",
  "element_id",
  "index",
];

const exports = {
  "source": { rows: sourceTable, headers: sourceTableHeaders },
  "target": { rows: targetTable, headers: targetTableHeaders },
  "tag": { rows: tagTable, headers: tagTableHeaders },
  "tagizationReference": {
    rows: tagizationReferenceTable,
    headers: tagizationReferenceTableHeaders,
  },
  "tagizationField": {
    rows: tagizationFieldTable,
    headers: tagizationFieldTableHeaders,
  },
  "reference": {
    rows: referenceTable,
    headers: referenceTableHeaders,
  },
  "field": { rows: fieldTable, headers: fieldTableHeaders },
  "element": { rows: elementTable, headers: elementTableHeaders },
  "category": {
    rows: categoryTable,
    headers: categoryTableHeaders,
  },
  "categorization": {
    rows: categorizationTable,
    headers: categorizationTableHeaders,
  },
};

export default async function exporter(entries: EntryType[]) {
  // populate sourceTable in advance for references
  for (const entry of entries) {
    const sourceRow = {
      id: createId(sourceTable.length + 1),
      value: entry.source.value,
      meaning: entry.source.meaning,
    };
    sourceTable.push(sourceRow);
  }

  for (const entry of entries) {
    // { source, target }
    // source.value, source.meaning?

    const sourceRow = sourceTable.find((s) =>
      s.value == entry.source.value && s.meaning == entry.source.meaning
    )!;

    for (const target of entry.target) {
      // { value, meaning? }

      const targetRow = {
        id: createId(targetTable.length + 1),
        meaning: target.meaning,
        source_id: sourceRow.id,
      };
      targetTable.push(targetRow);

      for (
        const [fieldOrReferenceIndex, fieldOrReference] of target.value
          .entries()
      ) {
        // reference
        if ((fieldOrReference as ReferenceType).kind) {
          const reference = fieldOrReference as ReferenceType;
          // { source, meaning, kind, tag }

          const sourceRowReference = sourceTable.find((s) =>
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
            id: createId(referenceTable.length + 1),
            target_id: targetRow.id,
            source_id: sourceRowReference.id,
            meaning: reference.meaning,
            kind: reference.kind,
          };
          referenceTable.push(referenceRow);

          for (const [tagIndex, tag] of reference.tag.entries()) {
            let tagRow = tagTable.find((t) => t.value == tag);

            if (!tagRow) {
              tagRow = {
                id: createId(tagTable.length + 1),
                value: tag,
              };
              tagTable.push(tagRow);
            }

            const tagizationRow = {
              id: createId(tagizationReferenceTable.length + 1),
              tag_id: tagRow.id,
              reference_id: referenceRow.id,
              index: tagIndex + 1,
            };
            tagizationReferenceTable.push(tagizationRow);
          }
          // field
        } else {
          const field = fieldOrReference as FieldType;
          // { value, tag }

          const fieldRow = {
            id: createId(fieldTable.length + 1),
            target_id: targetRow.id,
            index: fieldOrReferenceIndex + 1,
          };
          fieldTable.push(fieldRow);

          for (const [elementIndex, element] of field.value.entries()) {
            // { value, category }

            const elementRow = {
              id: createId(elementTable.length + 1),
              value: element.value,
              field_id: fieldRow.id,
              index: elementIndex + 1,
            };
            elementTable.push(elementRow);

            for (
              const [categoryIndex, category] of element.category.entries()
            ) {
              let categoryRow = categoryTable.find(
                (c) => c.value == category,
              );

              if (!categoryRow) {
                categoryRow = {
                  id: createId(categoryTable.length + 1),
                  value: category,
                };
                categoryTable.push(categoryRow);
              }

              const categorizationRow = {
                id: createId(categorizationTable.length + 1),
                category_id: categoryRow.id,
                element_id: elementRow.id,
                index: categoryIndex + 1,
              };
              categorizationTable.push(categorizationRow);
            }

            for (const [tagIndex, tag] of field.tag.entries()) {
              let tagRow = tagTable.find((t) => t.value == tag);

              if (!tagRow) {
                tagRow = {
                  id: createId(tagTable.length + 1),
                  value: tag,
                };
                tagTable.push(tagRow);
              }

              const tagizationRow = {
                id: createId(tagizationFieldTable.length + 1),
                tag_id: tagRow.id,
                field_id: fieldRow.id,
                index: tagIndex + 1,
              };
              tagizationFieldTable.push(tagizationRow);
            }
          }
        }
      }
    }
  }

  try {
    await Deno.mkdir("tables");
  } catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) {
      throw e;
    }
  }

  for (const [name, { rows, headers }] of Object.entries(exports)) {
    console.log(`Exporting ${name}.csv`);

    const csv = stringify(rows, { columns: headers });

    await Deno.writeTextFile(`tables/${name}.csv`, csv.trim());
  }

  console.log("Export success");
}
