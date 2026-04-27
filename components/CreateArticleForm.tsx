// components/CreateArticleForm.tsx
"use client";

import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useDropzone } from "react-dropzone";
import type { ApiError } from "../types/article.types";
import { Button } from "./ui/button";

interface CreateArticleData {
  title: string;
  preview_image: File | null;
  short_description: string;
  word_file: File | null;
  is_published: boolean;
}

const CreateArticleForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // Состояние формы
  const [formData, setFormData] = useState<CreateArticleData>({
    title: "",
    preview_image: null,
    short_description: "",
    word_file: null,
    is_published: true,
  });

  // Настройка dropzone для DOCX
  const onDropDocx = useCallback((acceptedFiles: File[]) => {
    setFormData((prev) => ({
      ...prev,
      word_file: acceptedFiles[0],
    }));
    setError("");
  }, []);

  const onDropRejectedDocx = useCallback(() => {
    setError("Пожалуйста, загрузите файл в формате DOCX");
  }, []);

  const {
    getRootProps: getRootPropsDocx,
    getInputProps: getInputPropsDocx,
    isDragActive: isDragActiveDocx,
  } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: onDropDocx,
    onDropRejected: onDropRejectedDocx,
  });

  // Настройка dropzone для изображения
  const onDropImage = useCallback((acceptedFiles: File[]) => {
    setFormData((prev) => ({
      ...prev,
      preview_image: acceptedFiles[0],
    }));
    setError("");
  }, []);

  const onDropRejectedImage = useCallback(() => {
    setError("Пожалуйста, загрузите изображение в формате JPG, PNG или GIF");
  }, []);

  const {
    getRootProps: getRootPropsImage,
    getInputProps: getInputPropsImage,
    isDragActive: isDragActiveImage,
  } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    onDrop: onDropImage,
    onDropRejected: onDropRejectedImage,
  });

  // Обработка изменений в текстовых полях
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработка чекбокса
  // const handleCheckboxChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   const { name, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: checked,
  //   }));
  // };

  // Отправка формы
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // Валидация
    if (!formData.title) {
      setError("Пожалуйста, введите заголовок статьи");
      return;
    }

    // if (!formData.short_description) {
    //   setError("Пожалуйста, введите краткое описание");
    //   return;
    // }

    // if (!formData.preview_image) {
    //   setError("Пожалуйста, загрузите превью изображение");
    //   return;
    // }

    if (!formData.word_file) {
      setError("Пожалуйста, загрузите Word файл");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    // submitData.append("preview_image", formData.preview_image);
    // submitData.append("short_description", formData.short_description);
    submitData.append("word_file", formData.word_file);
    submitData.append("is_published", String(formData.is_published));

    try {
      // Замените URL на ваш эндпоинт
      const response = await axios.post(
        "http://84.46.243.175:8000/api/articles/",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        },
      );
      console.log("Ответ сервера:", response.data);
      // Очищаем форму после успешной отправки
      setFormData({
        title: "",
        preview_image: null,
        short_description: "",
        word_file: null,
        is_published: true,
      });

      setSuccess(true);

      // Прокручиваем к началу формы
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(
        "Ошибка при создании статьи: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div
          className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200"
          role="alert"
        >
          <span className="font-medium">Ошибка!</span> {error}
        </div>
      )}

      {success && (
        <div
          className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200"
          role="alert"
        >
          <span className="font-medium">Успех!</span> Статья успешно создана!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Поле Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-[#333] font-normal mb-2"
          >
            Заголовок статьи
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-[1px]"
            placeholder="Напишите заголовок статьи"
            required
            aria-required="true"
            disabled={loading}
          />
        </div>

        {/* Поле Short Description */}
        {/* <div>
          <label
            htmlFor="short_description"
            className="block text-gray-700 font-medium mb-2"
          >
            Краткое описание <span className="text-red-500">*</span>
          </label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleInputChange}
            rows={4}
           className="w-full px-4 py-2 border border-gray-300 rounded-[1px]"
            placeholder="Введите краткое описание статьи"
            required
            aria-required="true"
            disabled={loading}
          />
        </div> */}
{/* 
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Превью изображение <span className="text-red-500">*</span>
          </label>

          <div
            {...getRootPropsImage()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActiveImage ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
              ${formData.preview_image ? "bg-green-50 border-green-500" : ""}
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            role="button"
            tabIndex={loading ? -1 : 0}
            aria-label="Область загрузки изображения"
          >
            <input
              {...getInputPropsImage()}
              disabled={loading}
              aria-label="Выберите изображение"
            />

            {formData.preview_image ? (
              <div>
                <svg
                  className="w-12 h-12 mx-auto text-green-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-green-600 font-medium">
                  {formData.preview_image.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(formData.preview_image.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600">
                  {isDragActiveImage
                    ? "Перетащите изображение сюда"
                    : "Перетащите изображение или кликните для выбора"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  JPG, PNG, GIF, WEBP (макс. 5MB)
                </p>
              </div>
            )}
          </div>
        </div> */}

        {/* Поле Word File */}
        <div>
          <div
            {...getRootPropsDocx()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActiveDocx ? "border-[#333] bg-blue-50" : "border-gray-300 hover:border-[#333]"}
              ${formData.word_file ? "bg-green-50 border-green-500" : ""}
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            role="button"
            tabIndex={loading ? -1 : 0}
            aria-label="Область загрузки DOCX файла"
          >
            <input
              {...getInputPropsDocx()}
              disabled={loading}
              aria-label="Выберите DOCX файл"
            />

            {formData.word_file ? (
              <div>
                <svg
                  className="w-12 h-12 mx-auto text-green-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-green-600 font-medium">
                  {formData.word_file.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(formData.word_file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600">
                  {isDragActiveDocx
                    ? "Перетащите DOCX файл сюда"
                    : "Перетащите файлы сюда или нажмите, чтобы загрузить"}
                </p>
                <p className="text-sm text-gray-400 mt-2">Только DOCX формат</p>
              </div>
            )}
          </div>
        </div>

        {/* Поле Is Published (чекбокс) */}
        {/* <div className="flex items-center">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            checked={formData.is_published}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label
            htmlFor="is_published"
            className="ml-2 text-gray-700 font-medium"
          >
            Опубликовать сразу
          </label>
        </div> */}

        {/* Кнопка отправки */}
        <Button
          type="submit"
          disabled={loading}
          variant="outline"
          className="w-full "
          aria-label="Создать статью"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Отправка...
            </span>
          ) : (
            "Создать статью"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateArticleForm;
