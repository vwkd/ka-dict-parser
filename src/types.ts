export type MeaningType = number;

export type ValueType = string;

// todo: add more
export type TagType = "KACH";

export type KindType = "DIRECT" | "MEANING" | "IDENTICAL";

export interface SourceType {
  value: ValueType;
  meaning: MeaningType;
}

export interface TargetType {
  value: ValueType[];
  meaning: MeaningType;
  tags: TagType[];
}

export interface ReferenceType {
  id: IdType;
  source: SourceType;
  kind: KindType;
  tags: TagType[];
}

export interface TargetEntryType {
  id: IdType;
  source: SourceType;
  target: TargetType[];
}

export interface ReferenceEntryType {
  id: IdType;
  source: SourceType;
  reference: ReferenceType;
}

export type EntryType = TargetEntryType | ReferenceEntryType;
