// hooks/useArticleForm.ts
import { useState, useCallback } from "react";
import axios from "axios";
import type { ArticleData, DocxUploadResponse } from "@/types/article.types";

interface UseArticleFormReturn {
  step: number;
  loading: boolean;
  error: string;
  docxFile: File | null;
  formData: ArticleData;
  setDocxFile: (file: File | null) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadDocx: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleSubmitArticle: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleBackToFirstStep: () => void;
}

export const useArticleForm = (): UseArticleFormReturn => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ArticleData>({
    title: "",
    image: null,
    desc: "",
    link: "",
  });

  const handleUploadDocx = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!docxFile) {
        setError("Пожалуйста, выберите файл");
        return;
      }

      setLoading(true);
      setError("");

      const uploadData = new FormData();
      uploadData.append("file", docxFile);

      try {
        const response = await axios.post<DocxUploadResponse>(
          "/api/upload-docx",
          uploadData,
        );

        setFormData((prev) => ({
          ...prev,
          link: response.data.link,
        }));

        setStep(2);
      } catch (err) {
        setError("Ошибка при загрузке файла");
      } finally {
        setLoading(false);
      }
    },
    [docxFile],
  );

  const handleSubmitArticle = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!formData.title || !formData.desc || !formData.image) {
        setError("Пожалуйста, заполните все обязательные поля");
        return;
      }

      setLoading(true);
      setError("");

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("image", formData.image);
      submitData.append("desc", formData.desc);
      submitData.append("link", formData.link);

      try {
        await axios.post("/api/create-article", submitData);

        setStep(1);
        setDocxFile(null);
        setFormData({
          title: "",
          image: null,
          desc: "",
          link: "",
        });

        alert("Статья успешно создана!");
      } catch (err) {
        setError("Ошибка при создании статьи");
      } finally {
        setLoading(false);
      }
    },
    [formData],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
      }
    },
    [],
  );

  const handleBackToFirstStep = useCallback(() => {
    setStep(1);
  }, []);

  return {
    step,
    loading,
    error,
    docxFile,
    formData,
    setDocxFile,
    handleInputChange,
    handleImageChange,
    handleUploadDocx,
    handleSubmitArticle,
    handleBackToFirstStep,
  };
};
