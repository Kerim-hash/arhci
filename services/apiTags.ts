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
  },
});
