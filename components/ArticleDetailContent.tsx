import { useMemo } from "react";

// components/ArticleDetail.tsx (обновленный ArticleContent)
export const ArticleContent = ({ content }: { content: string }) => {
  const processedContent = useMemo(() => {
    if (!content) return "";

    const processed = content;

    // 1. Извлекаем стили из head и применяем их
    const styleMatch = processed.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const styles = styleMatch ? styleMatch[1] : "";

    // 2. Извлекаем body контент
    const bodyMatch = processed.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : processed;

    // 3. Конвертируем p.western в обычные параграфы с классами
    bodyContent = bodyContent
      .replace(
        /<p class="western"([^>]*)>([\s\S]*?)<\/p>/g,
        '<p class="western-paragraph" $1>$2</p>',
      )
      .replace(/<p([^>]*)>/g, '<p$1 class="western-paragraph">');

    // 4. Конвертируем h1.western в заголовки с классами
    bodyContent = bodyContent.replace(
      /<h1 class="western"([^>]*)>([\s\S]*?)<\/h1>/g,
      '<h1 class="western-heading" $1>$2</h1>',
    );

    // 5. Обрабатываем изображения - добавляем правильные пути
    bodyContent = bodyContent.replace(
      /<img([^>]*)src="([^"]*\.(png|jpg|jpeg|gif|webp))"([^>]*)>/g,
      (match, before, src, ext, after) => {
        // Если это изображение из временных файлов или относительный путь
        if (
          src.includes("document_html_") ||
          src.startsWith("document_html_")
        ) {
          return `<div class="image-placeholder">
            <div class="bg-gray-100 p-4 rounded-lg text-center">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-600">Изображение: ${src.replace(/^document_html_/, "")}</p>
            </div>
          </div>`;
        }

        // Если путь относительный, добавляем базовый URL
        if (src.startsWith("/")) {
          return `<img${before}src="https://api.ardi.kg${src}"${after} class="word-image" loading="lazy" />`;
        }

        // Если путь уже абсолютный
        return `<img${before}src="${src}"${after} class="word-image" loading="lazy" />`;
      },
    );

    // 6. Обрабатываем ссылки
    bodyContent = bodyContent.replace(
      /<a([^>]*)>([\s\S]*?)<\/a>/g,
      '<a$1 class="word-link" target="_blank" rel="noopener noreferrer">$2</a>',
    );

    // 7. Убираем лишние br и очищаем
    bodyContent = bodyContent
      .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br/>")
      .replace(/&nbsp;/g, " ");

    // 8. Добавляем структуру для выделения важных элементов
    bodyContent = bodyContent.replace(
      /<(p|div) class="[^"]*"[^>]*>([\s\S]*?)(\d+\.\s*(Create|Save|Financial|Budget|Strategy))([\s\S]*?)<\/\1>/gi,
      '<div class="highlight-box important-block">$&</div>',
    );

    // 9. Оборачиваем таблицы в контейнер для скролла
    bodyContent = bodyContent.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-container"><table$1>$2</table></div>',
    );

    return `
      <style>
        .word-article-wrapper {
          font-family: 'Proxima Nova Rg', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 2rem;
          line-height: 1.6;
          color: #333;
          background: #fff;
          overflow-x: hidden;
        }
        
        .word-article-wrapper .content-wrapper {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }
        
        .word-article-wrapper .western-paragraph {
          margin-bottom: 1.25rem;
          text-align: left;
          line-height: 1.7;
          font-size: 1rem;
          width: 100%;
        }
        
        .word-article-wrapper .western-heading {
          color: #9f6bdb;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 2.5rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9d5ff;
          width: 100%;
        }
        
        .word-article-wrapper .word-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 2rem auto;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }
        
        .word-article-wrapper .image-placeholder {
          margin: 2rem 0;
          width: 100%;
        }
        
        .word-article-wrapper .word-link {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .word-article-wrapper .word-link:hover {
          color: #1d4ed8;
        }
        
        .word-article-wrapper .highlight-box {
          background-color: #f8f5ff;
          border-left: 4px solid #9f6bdb;
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 12px 12px 0;
          width: 100%;
        }
        
        .word-article-wrapper .important-block {
          background: linear-gradient(to right, #f8f5ff, transparent);
        }
        
        .word-article-wrapper .table-container {
          overflow-x: auto;
          margin: 1.5rem 0;
          border-radius: 8px;
          border: 1px solid #eaeaea;
          width: 100%;
        }
        
        .word-article-wrapper .table-container table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
          min-width: 600px;
        }
        
        .word-article-wrapper .table-container th {
          background-color: #f3f4f6;
          font-weight: 600;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          text-align: left;
        }
        
        .word-article-wrapper .table-container td {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
        }
        
        .word-article-wrapper .table-container tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .word-article-wrapper ul, .word-article-wrapper ol {
          margin: 1rem 0;
          padding-left: 2rem;
          width: 100%;
        }
        
        .word-article-wrapper li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .word-article-wrapper blockquote {
          border-left: 4px solid #e5e7eb;
          padding: 0.75rem 0 0.75rem 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4b5563;
          background-color: #f9fafb;
          border-radius: 0 8px 8px 0;
          width: 100%;
        }
        
        .word-article-wrapper .document-meta {
          margin-top: 3rem;
          padding: 1.5rem 0;
          border-top: 2px solid #eaeaea;
          font-size: 0.875rem;
          color: #6b7280;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          width: 100%;
          background: #f9f9f9;
        }
        
        @media (max-width: 768px) {
          .word-article-wrapper {
            padding: 1rem;
          }
          
          .word-article-wrapper .western-heading {
            font-size: 1.25rem;
            margin: 1.5rem 0 0.75rem;
          }
          
          .word-article-wrapper .western-paragraph {
            font-size: 0.95rem;
          }
          
          .word-article-wrapper .table-container {
            font-size: 0.85rem;
          }
        }
      </style>
      <div class="content-wrapper">
        ${bodyContent}
      </div>
      <div class="document-meta">
        <span>📅 ${new Date().toLocaleDateString("ru-RU")}</span>
        <span>📄 Статья с сайта</span>
      </div>
    `;
  }, [content]);

  return (
    <div
      className="word-article-wrapper w-full my-10 bg-white shadow-sm rounded-xl p-4 sm:p-8"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};
