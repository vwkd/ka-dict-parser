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

export type DefinitionType = ReferenceType | FieldType;

export interface TargetType {
  value: DefinitionType[];
  meaning: MeaningType;
}

export interface EntryType {
  id: IdType;
  source: SourceType;
  target: TargetType[];
}
