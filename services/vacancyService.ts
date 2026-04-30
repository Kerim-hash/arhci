// services/vacancyService.ts
// Этот файл больше не нужен — все запросы теперь идут через RTK Query (generatedApi.ts)
// Оставлен для обратной совместимости, но рекомендуется использовать хуки из generatedApi напрямую.

export {
  useApiVacanciesRetrieveQuery,
  useApiVacanciesSimilarListQuery,
  useApiVacanciesSaveCreateMutation,
  useApiVacanciesRespondCreateMutation,
  useApiVacanciesListQuery,
  useApiVacanciesCreateCreateMutation,
} from "@/services/generatedApi";
