/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";

const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export const ArticleContent = ({ article }: { article: any }) => {
  const [zoomImages, setZoomImages] = useState<string[]>([]);
  const [zoomIndex, setZoomIndex] = useState<number>(-1);
  const content = article.contentHtml || article.content || "";

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const src = (target as HTMLImageElement).src;
      if (src) {
        // Collect all images in the container for the slider navigation
        const allImgs = Array.from(e.currentTarget.querySelectorAll("img"));
        const allSrcs = allImgs.map(img => img.src).filter(Boolean);
        const idx = allSrcs.indexOf(src);
        if (idx !== -1) {
          setZoomImages(allSrcs);
          setZoomIndex(idx);
        }
      }
    }
  };

  useEffect(() => {
    if (zoomIndex === -1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setZoomIndex(prev => (prev < zoomImages.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setZoomIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Escape") {
        setZoomIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIndex, zoomImages.length]);

  const articleDate = useMemo(() => {
    return article.createdAt ? new Date(article.createdAt).toLocaleDateString("ru-RU") : "";
  }, [article.createdAt]);

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
      (match: string, before: string, src: string, ext: string, after: string) => {
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
        .word-article-wrapper img {
          cursor: zoom-in;
          transition: transform 0.2s ease-in-out;
        }
        .word-article-wrapper img:hover {
          transform: scale(1.02);
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

  if (article.contentMode === "editor" || (article.blocks && article.blocks.length > 0)) {
    return (
      <>
        <div 
          className="word-article-wrapper w-full my-10 bg-white shadow-sm rounded-xl p-4 sm:p-8"
          onClick={handleContainerClick}
        >
          <style>{`
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
            .word-article-wrapper p {
              margin-bottom: 1.25rem;
              text-align: left;
              line-height: 1.7;
              font-size: 1rem;
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
            .word-article-wrapper img {
              cursor: zoom-in;
              transition: transform 0.2s ease-in-out;
            }
            .word-article-wrapper img:hover {
              transform: scale(1.02);
            }
            .word-article-wrapper .word-link {
              color: #2563eb;
              text-decoration: underline;
              text-underline-offset: 2px;
            }
            .word-article-wrapper .word-link:hover {
              color: #1d4ed8;
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
          `}</style>
          <div className="content-wrapper">
            {article.blocks.map((block: any) => {
              switch (block.type) {
                case "text":
                  return (
                    <div
                      key={block.id}
                      className="mb-6"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  );
                case "image": {
                  const imgUrl = block.images && block.images[0]?.image;
                  return (
                    <div key={block.id} className="my-8">
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={block.altText || "Изображение"}
                          className="word-image"
                          loading="lazy"
                        />
                      )}
                      {block.altText && (
                        <p className="text-center text-xs text-gray-500 mt-2 italic">
                          {block.altText}
                        </p>
                      )}
                    </div>
                  );
                }
                case "video": {
                  const embedUrl = getYoutubeEmbedUrl(block.content);
                  return (
                    <div key={block.id} className="my-8">
                      {embedUrl ? (
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                          <iframe
                            src={embedUrl}
                            className="w-full aspect-video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={block.altText || "YouTube видео"}
                          />
                        </div>
                      ) : (
                        <a
                          href={block.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="word-link break-all"
                        >
                          {block.content}
                        </a>
                      )}
                      {block.altText && (
                        <p className="text-center text-xs text-gray-500 mt-2 italic">
                          {block.altText}
                        </p>
                      )}
                    </div>
                  );
                }
                case "gallery":
                  return (
                    <div key={block.id} className="my-8">
                      {block.images && block.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {block.images.map((imgObj: any) => (
                            <div
                              key={imgObj.id}
                              className="rounded-xl overflow-hidden shadow-sm border border-gray-100"
                            >
                              <img
                                src={imgObj.image}
                                alt={block.altText || "Галерея"}
                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {block.altText && (
                        <p className="text-center text-xs text-gray-500 mt-2 italic">
                          {block.altText}
                        </p>
                      )}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          <div className="document-meta">
            {articleDate && <span>📅 {articleDate}</span>}
            <span>📄 Статья с сайта</span>
          </div>
        </div>
        {zoomIndex >= 0 && zoomImages.length > 0 && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
            onClick={() => setZoomIndex(-1)}
          >
            <button 
              type="button" 
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors cursor-pointer z-55"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(-1);
              }}
              aria-label="Закрыть"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {zoomIndex > 0 && (
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-55"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomIndex(prev => prev - 1);
                }}
                aria-label="Предыдущее"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
              </button>
            )}

            {zoomIndex < zoomImages.length - 1 && (
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-55"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomIndex(prev => prev + 1);
                }}
                aria-label="Следующее"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            )}

            <div 
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={zoomImages[zoomIndex]} 
                alt={`Zoomed image ${zoomIndex + 1}`} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 animate-in zoom-in-95 duration-200"
                key={zoomIndex}
              />
              {zoomImages.length > 1 && (
                <span className="text-white/60 text-xs px-3 py-1 bg-white/10 rounded-full backdrop-blur-xs">
                  {zoomIndex + 1} / {zoomImages.length}
                </span>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div
        className="word-article-wrapper w-full my-10 bg-white shadow-sm rounded-xl p-4 sm:p-8"
        dangerouslySetInnerHTML={{ __html: processedContent }}
        onClick={handleContainerClick}
      />
      {zoomIndex >= 0 && zoomImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setZoomIndex(-1)}
        >
          <button 
            type="button" 
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors cursor-pointer z-55"
            onClick={(e) => {
              e.stopPropagation();
              setZoomIndex(-1);
            }}
            aria-label="Закрыть"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {zoomIndex > 0 && (
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-55"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(prev => prev - 1);
              }}
              aria-label="Предыдущее"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
          )}

          {zoomIndex < zoomImages.length - 1 && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-55"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(prev => prev + 1);
              }}
              aria-label="Следующее"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          )}

          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomImages[zoomIndex]} 
              alt={`Zoomed image ${zoomIndex + 1}`} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 animate-in zoom-in-95 duration-200"
              key={zoomIndex}
            />
            {zoomImages.length > 1 && (
              <span className="text-white/60 text-xs px-3 py-1 bg-white/10 rounded-full backdrop-blur-xs">
                {zoomIndex + 1} / {zoomImages.length}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};
