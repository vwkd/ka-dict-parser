import uuidByString from "$uuid-by-string";

// ns:DNS UUID v5 for "kita.ge"
const namespace = "2004eaab-0273-5206-b642-db704a5e506c";

export function createId(value) {
  const uuid = uuidByString(value.toString(), namespace, 5);

  // only use first 8 chars
  return uuid.split("-")[0];
}