/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { promisify } from "util";
import path from "path";

interface DocxUploadResponse {
  link: string;
  message?: string;
}

// Настройка multer для загрузки файлов
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Только DOCX файлы разрешены"));
    }
  },
});

const uploadMiddleware = promisify(upload.single("file"));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocxUploadResponse | { message: string }>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

  try {
    await uploadMiddleware(req as any, res as any);

    // Здесь вы можете обработать DOCX файл
    // Например, извлечь из него текст или сохранить

    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({ message: "Файл не загружен" });
    }

    // Генерируем ссылку на файл или результат обработки
    const link = `/uploads/${file.filename}`;

    res.status(200).json({
      link,
      message: "Файл успешно загружен",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Ошибка загрузки файла";
    res.status(500).json({ message: errorMessage });
  }
}
