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
}

export interface DefinitionType {
  value: string[];
}

export type ValueType = ReferenceType | DefinitionType;

export interface TargetType {
  value: ValueType;
  meaning: MeaningType;
  tags: TagType[];
}

export interface EntryType {
  id: IdType;
  source: SourceType;
  target: TargetType[];
}
