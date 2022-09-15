export type IdType = number;

export type MeaningType = number;

// todo: add more
export type TagType = "KACH";

export type KindType = "DIRECT" | "MEANING" | "IDENTICAL";

export interface SourceType {
  value: string;
  meaning: MeaningType;
}

export interface ReferenceType {
  id: IdType;
  source: SourceType;
  kind: KindType;
  tags: TagType[];
}

export interface FieldType {
  value: string[];
  tags: TagType[];
}

export type ValueType = ReferenceType | FieldType;

export interface DefinitionType {
  value: ValueType[];
}

export interface TargetType {
  definition: DefinitionType;
  meaning: MeaningType;
}

export interface EntryType {
  id: IdType;
  source: SourceType;
  target: TargetType[];
}
