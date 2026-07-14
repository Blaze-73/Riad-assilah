export function applyLang(doc, lang, fields) {
  if (!doc || !lang || lang === 'en') return doc;
  const result = doc.toObject ? doc.toObject() : { ...doc };
  for (const [base, langField] of Object.entries(fields)) {
    const localized = result[`${base}${lang === 'fr' ? 'Fr' : 'Ar'}`];
    if (localized !== null && localized !== undefined) {
      result[base] = localized;
    }
  }
  return result;
}

export function applyLangArray(docs, lang, fields) {
  if (!lang || lang === 'en') return docs;
  return docs.map(d => applyLang(d, lang, fields));
}
