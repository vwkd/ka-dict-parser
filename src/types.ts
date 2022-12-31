type ID = number;
// greater than zero
type Integer = number;
type Text = string;

export interface EntryType {
  source: SourceType;
  target: TargetType[];
}

export interface SourceType {
  value: Text;
  meaning?: Integer;
}

export interface TargetType {
  value: (ReferenceType | FieldType)[];
  meaning?: Integer;
}

type KindType =
  | "DIRECT"
  | "MEANING"
  | "IDENTICAL";

export interface ReferenceType {
  source: SourceType;
  meaning?: Integer;
  kind: KindType;
  tags: TagType[];
}

export interface FieldType {
  value: ElementType[];
  tags: TagType[];
}

export interface ElementType {
  value: Text;
  category: Text[];
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

// ======= Tables =======

interface Table {
  id: ID;
}

export interface SourceRow extends Table {
  value: Text;
  meaning?: Integer;
}

export interface TargetRow extends Table {
  source: ID;
  meaning?: Integer;
}

export interface ReferenceRow extends Table {
  target: ID;
  source: ID;
  kind: KindType;
}

export interface FieldRow extends Table {
  target: ID;
  index: Integer;
}

export interface ElementRow extends Table {
  field: ID;
  index: Integer;
  value: Text;
}

export interface CategoryRow extends Table {
  // todo: unique
  value: Text;
}

export interface CategorizationRow extends Table {
  category: ID;
  element: ID;
}

export interface TagRow extends Table {
  // todo: unique
  value: Text;
}

export type TagizationRow = TagizationReferenceRow | TagizationFieldRow;

export interface TagizationReferenceRow extends Table {
  tag: ID;
  reference: ID;
}

export interface TagizationFieldRow extends Table {
  tag: ID;
  field: ID;
}
