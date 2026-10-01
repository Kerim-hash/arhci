import DOMPurify from "isomorphic-dompurify";

/**
 * Очищает HTML перед dangerouslySetInnerHTML.
 *
 * Бэкенд чистит пользовательский HTML на входе, но контент, сохранённый до
 * этого, и разметка из админки проходят здесь второй рубеж. Галереи
 * `.ardi-gallery` держат данные в data-атрибутах — DOMPurify их сохраняет.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["style", "form", "input", "textarea", "select", "button"],
  });
}
