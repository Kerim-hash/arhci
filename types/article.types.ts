// types/article.types.ts
export interface DocxUploadResponse {
  link: string;
  message?: string;
}

export interface ArticleData {
  title: string;
  image: File | null;
  desc: string;
  link: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
