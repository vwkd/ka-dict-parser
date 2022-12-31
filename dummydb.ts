type ID = number;
type Integer = number;

// ------ Tables -------

interface Table {
  id: ID;
}

interface Source extends Table {
  value: string;
  index?: Integer;
}

interface Target extends Table {
  source: ID;
  index: Integer;
}

interface Tag extends Table {
  // todo: validate unique
  value: string;
}

type TagizationItem = TagizationItemField | TagizationItemReference;

interface TagizationItemField extends Table {
  tag: ID;
  // todo: target??? instead
  field: ID;
}

interface TagizationItemReference extends Table {
  tag: ID;
  // todo: target??? instead
  reference: ID;
}

// todo: other kinds
type Kind = "DIRECT";

interface Reference extends Table {
  target: ID;
  source: ID;
  kind: Kind;
}

interface Field extends Table {
  target: ID;
  index: Integer;
}

interface Element extends Table {
  field: ID;
  index: Integer;
  value: string;
}

interface Category extends Table {
  // todo: validate unique
  value: string;
}

interface CategorizationItem extends Table {
  category: ID;
  element: ID;
}

// ------- Data -------

const sources: Source[] = [
  {
    id: 1,
    value: "აბეზარ",
  },
  {
    id: 2,
    value: "აბეჩხრ",
  },
  {
    id: 8,
    value: "ავად",
  },
];

const targets: Target[] = [
  {
    id: 1,
    source: 1,
    index: 1,
  },
  {
    id: 2,
    source: 2,
    index: 1,
  },
  {
    id: 99,
    source: 8,
    index: 1,
  },
];

const references: Reference[] = [
  {
    id: 1,
    target: 99,
    source: 99,
    kind: "DIRECT",
  },
];

const fields: Field[] = [
  {
    id: 1,
    target: 1,
    index: 1,
  },
  {
    id: 2,
    target: 2,
    index: 1,
  },
];

const tags: Tag[] = [
  {
    id: 1,
    value: "FOO",
  },
  {
    id: 2,
    value: "BAR",
  },
];

const tagization: TagizationItem[] = [
  {
    id: 1,
    tag: 1,
    field: 99,
    // reference: 99,
  },
];

const elements: Element[] = [
  {
    id: 1,
    field: 1,
    index: 1,
    value: "rastlos sein",
  },
  {
    id: 2,
    field: 1,
    index: 2,
    value: "lästig sein",
  },
  {
    id: 3,
    field: 2,
    index: 1,
    value: "verwahrlosen lassen",
  },
];

const categories: Category[] = [
  {
    id: 1,
    value: "FOO",
  },
  {
    id: 2,
    value: "BAR",
  },
];

const categorization: CategorizationItem[] = [
  {
    id: 1,
    category: 1,
    element: 99,
  },
];

// ------ Entry ------

interface Entry {
  id: ID;
  source: string;
  targets: TargetEntry[];
}

interface TargetEntry {
  index: Integer;
  value: FieldEntry[] | ReferenceEntry;
}

interface ReferenceEntry {
  source: string;
  index?: Integer;
  kind: Kind;
  tags: string[];
}

interface FieldEntry {
  elements: ElementEntry[];
  tags: string[];
}

interface ElementEntry {
  value: string;
  categories: string[];
}

// ------ main -------

// todo: handle undefined cases
// todo: handle unexpected empty array
function getEntry(id: ID): Entry {
  const source = sources.find((s) => s.id == id)!;

  const targetEntries = targets.filter((t) => t.source == id);

  const targetList: TargetEntry[] = targetEntries.map((t) => {
    const referenceEntry = references.find((r) => r.target == t.id);

    if (referenceEntry) {
      // todo: delete tmp default
      const sourceValue = sources.find((s) => s.id == referenceEntry.source)! ||
        { value: "tmp_default" };

      const tagizationEntries = tagization.filter((tz) =>
        tz.reference == referenceEntry.id
      );
      const tagList = tagizationEntries.map((tz) =>
        tags.find((tg) => tg.id == tz.tag)!
      ).map((tg) => tg.value);

      const referenceValue = {
        source: sourceValue.value,
        index: sourceValue.index,
        kind: referenceEntry.kind,
        tags: tagList,
      };

      return {
        index: t.index,
        value: referenceValue,
      };
    }

    const fieldEntries = fields.filter((f) => f.target == t.id);

    const fieldList: FieldEntry[] = fieldEntries.map((f) => {
      const tagizationEntries = tagization.filter((tz) => tz.field == f.id);
      const tagList = tagizationEntries.map((tz) =>
        tags.find((tg) => tg.id == tz.tag)!
      ).map((tg) => tg.value);

      const elementEntries = elements.filter((e) => e.field == f.id);
      const elementList: ElementEntry[] = elementEntries.map((e) => {
        const categorizationEntries = categorization.filter((c) =>
          c.element == e.id
        );
        const categoryList = categorizationEntries.map((cz) =>
          categories.find((c) => c.id == cz.category)!
        ).map((c) => c.value);
        return {
          index: e.index,
          value: e.value,
          categories: categoryList,
        };
      }).sort((a, b) => a.index - b.index).map((o) => {
        delete o.index;
        return o;
      });

      return {
        index: f.index,
        elements: elementList,
        tags: tagList,
      };
    }).sort((a, b) => a.index - b.index).map((o) => {
      delete o.index;
      return o;
    });

    return {
      index: t.index,
      value: fieldList,
    };
  }).sort((a, b) => a.index - b.index).map((o) => {
    delete o.index;
    return o;
  });

  return {
    id,
    source: source.value,
    targets: targetList,
  };
}

console.log(JSON.stringify(getEntry(8), null, 2));
