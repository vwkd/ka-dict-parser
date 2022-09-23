export interface EntryType {
  id: IdType;
  source: SourceType;
  target: TargetType[];
}

export interface SourceType {
  value: string;
  meaning?: MeaningType;
}

export interface TargetType {
  value: DefinitionType[];
  meaning?: MeaningType;
}

export type DefinitionType = ReferenceType | FieldType;

export interface ReferenceType {
  id: IdType;
  source: SourceType;
  meaning?: MeaningType;
  kind: KindType;
  tags: TagType[];
}

export type KindType = "DIRECT" | "MEANING" | "IDENTICAL";

export interface FieldType {
  value: ElementType[];
  tags: TagType[];
}

export interface ElementType {
  value: string;
  category: string[];
}

export type TagType = "BIOL" | "BOT" | "CHEM" | "CHEW" | "DESP" | "ELEKTR" | "ETHN" | "FIG" | "GR" | "GUR" | "HIST" | "HV" | "IMER" | "ING" | "IRO" | "JUR" | "KACH" | "KHAR" | "KHIS" | "LANDW" | "LETSCH" | "MATH" | "MED" | "MIL" | "MOCH" | "MORAL" | "MTHIUL" | "MUS" | "NEG" | "NZ" | "O_IMER" | "PHOTOGR" | "PHYS" | "POET" | "POL" | "PSCH" | "RATSCH" | "RL" | "SPO" | "TECH" | "THUSCH" | "TYP" | "U_IMER" | "U_RATSCH" | "UMG" | "UNK" | "VA" | "VULG";

export type IdType = number;

export type MeaningType = number;