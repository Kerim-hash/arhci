// services/vacancyService.ts
import { VacancyDetail, SimilarVacancy } from "@/types/vacancy";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";

export const vacancyService = {
  // Получить детальную информацию о вакансии
  async getVacancyById(id: string): Promise<VacancyDetail> {
    const response = await fetch(`${API_BASE_URL}/api/vacancies/${id}`);
    if (!response.ok) throw new Error("Failed to fetch vacancy");
    return response.json();
  },

  // Получить похожие вакансии
  async getSimilarVacancies(
    id: string,
    limit: number = 3,
  ): Promise<SimilarVacancy[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/vacancies/${id}/similar?limit=${limit}`,
    );
    if (!response.ok) throw new Error("Failed to fetch similar vacancies");
    return response.json();
  },

  // Сохранить вакансию
  async saveVacancy(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/vacancies/${id}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Добавьте токен авторизации
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  },

  // Откликнуться на вакансию
  async respondToVacancy(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/api/vacancies/${id}/respond`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  },
};
