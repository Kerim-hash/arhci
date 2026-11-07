/**
 * Форма существительного по числу: pluralRu(5, ["вакансия", "вакансии", "вакансий"]) → "вакансий".
 * Формы — для 1, для 2–4 и для 5–20 (и всех остальных случаев).
 */
export function pluralRu(count: number, forms: readonly [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
