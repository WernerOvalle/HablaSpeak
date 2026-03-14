export const ERROR_LABELS: Record<string, string> = {
  grammar: 'Gramatica',
  vocabulary: 'Vocabulario',
  verb_tense: 'Tiempos verbales',
  prepositions: 'Preposiciones',
  articles: 'Articulos',
  sentence_structure: 'Estructura de oracion',
  fluency: 'Fluidez',
  pronunciation: 'Pronunciacion',
};

export function getErrorLabel(errorKey: string) {
  return ERROR_LABELS[errorKey] || 'Correccion general';
}
