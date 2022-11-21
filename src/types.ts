export interface EntryType {
  source: SourceType;
  target: TargetType[];
}

export interface SourceType {
  value: string;
  meaning?: number;
}

export interface TargetType {
  value: DefinitionType[];
  meaning?: number;
}

export type DefinitionType = ReferenceType | FieldType;

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
  value: string;
  meaning?: number;
}

export interface TargetRow {
  id: number;
  meaning?: number;
  source: number;
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
  source: number;
  meaning?: number;
  kind: "DIRECT" | "MEANING" | "IDENTICAL";
  target: number;
  definitionIndex: number;
}

export interface ElementRow {
  id: number;
  value: string;
  target: number;
  definitionIndex: number;
  elementIndex: number;
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
