import { generatedApi } from "./generatedApi";

// Навешивает теги на сгенерированные эндпоинты, чтобы мутации
// (например, лайки из authApi) могли инвалидировать их кэш.
// Файл generatedApi.ts перезаписывается кодогенерацией, поэтому
// теги живут здесь, а не в нём.
generatedApi.enhanceEndpoints({
  endpoints: {
    apiSpecialistsList: { providesTags: ["Specialists"] },
    apiSpecialistsTopList: { providesTags: ["Specialists"] },
    apiSpecialistsRetrieve: { providesTags: ["Specialists"] },
    apiProjectsList: { providesTags: ["Projects"] },
    apiProjectsRetrieve: { providesTags: ["Projects"] },
    apiProjectsSpecialistList: { providesTags: ["Projects"] },
    apiProjectsCreateCreate: { invalidatesTags: ["Projects"] },
    apiProjectsPartialUpdate: { invalidatesTags: ["Projects"] },
    apiProjectsDestroy: { invalidatesTags: ["Projects"] },

    apiVacanciesList: { providesTags: ["Vacancies"] },
    apiVacanciesRetrieve: { providesTags: ["Vacancies"] },
    apiVacanciesSimilarList: { providesTags: ["Vacancies"] },
    apiVacanciesMyResponsesList: { providesTags: ["Vacancies"] },
    apiVacanciesResponsesList: { providesTags: ["Vacancies"] },
    apiVacanciesCreateCreate: { invalidatesTags: ["Vacancies"] },
    apiVacanciesDestroy: { invalidatesTags: ["Vacancies"] },
    apiVacanciesRespondCreate: { invalidatesTags: ["Vacancies"] },
    apiVacanciesSaveCreate: { invalidatesTags: ["Vacancies"] },

    apiResumesList: { providesTags: ["Resumes"] },
    apiResumesRetrieve: { providesTags: ["Resumes"] },
    apiResumesCreateCreate: { invalidatesTags: ["Resumes"] },
    apiResumesDestroy: { invalidatesTags: ["Resumes"] },

    apiOrdersList: { providesTags: ["Orders"] },
    apiOrdersRetrieve: { providesTags: ["Orders"] },
    apiOrdersMyResponsesList: { providesTags: ["Orders"] },
    apiOrdersResponsesList: { providesTags: ["Orders"] },
    apiOrdersCreateCreate: { invalidatesTags: ["Orders"] },
    apiOrdersDestroy: { invalidatesTags: ["Orders"] },
    apiOrdersRespondCreate: { invalidatesTags: ["Orders"] },

    apiCompetitionsList: { providesTags: ["Competitions"] },
    apiCompetitionsRetrieve: { providesTags: ["Competitions"] },
    apiCompetitionsSlugRetrieve: { providesTags: ["Competitions"] },
    apiCompetitionsCreateCreate: { invalidatesTags: ["Competitions"] },
    apiCompetitionsDestroy: { invalidatesTags: ["Competitions"] },

    apiArticlesList: { providesTags: ["Articles"] },
    apiArticlesRetrieve: { providesTags: ["Articles"] },
    apiArticlesCreateCreate: { invalidatesTags: ["Articles"] },
    apiArticlesDestroy: { invalidatesTags: ["Articles"] },
  },
});
