export interface EntryType {
  source: SourceType;
  target: TargetType[];
}

export interface SourceType {
  value: string;
  meaning?: number;
}

export interface TargetType {
  value: (ReferenceType | FieldType)[];
  meaning?: number;
}

export interface ReferenceType {
  source: SourceType;
  meaning?: number;
  kind: "DIRECT" | "MEANING" | "IDENTICAL";
  tags: TagType[];
}

export interface FieldType {
  value: ElementType[];
  tags: TagType[];
}

export interface ElementType {
  value: string;
  category: string[];
}

export type TagType =
  | "BIOL"
  | "BOT"
  | "CHEM"
  | "CHEW"
  | "DESP"
  | "ELEKTR"
  | "ETHN"
  | "FIG"
  | "GR"
  | "GUR"
  | "HIST"
  | "HV"
  | "IMER"
  | "ING"
  | "IRO"
  | "JUR"
  | "KACH"
  | "KHAR"
  | "KHIS"
  | "LANDW"
  | "LETSCH"
  | "MATH"
  | "MED"
  | "MIL"
  | "MOCH"
  | "MORAL"
  | "MTHIUL"
  | "MUS"
  | "NEG"
  | "NZ"
  | "O_IMER"
  | "PHOTOGR"
  | "PHYS"
  | "POET"
  | "POL"
  | "PSCH"
  | "RATSCH"
  | "RL"
  | "SPO"
  | "TECH"
  | "THUSCH"
  | "TYP"
  | "U_IMER"
  | "U_RATSCH"
  | "UMG"
  | "UNK"
  | "VA"
  | "VULG";

export interface SourceRow {
  id: number;
  meaning?: number;
  value: string;
}

export interface TargetRow {
  id: number;
  source: number;
  meaning?: number;
}

export interface TagRow {
  id: number;
  value: string;
}

export interface TagizationRow {
  id: number;
  tag: number;
  target: number;
}

export interface ReferenceRow {
  id: number;
  target: number;
  source: number;
  kind: "DIRECT" | "MEANING" | "IDENTICAL";
  meaning?: number;
}

export interface FieldRow {
  id: number;
  target: number;
  index: number;
}

export interface ElementRow {
  id: number;
  field: number;
  index: number;
  value: string;
}

export interface CategoryRow {
  id: number;
  value: string;
}

export interface CategorizationRow {
  id: number;
  category: number;
  element: number;
}
