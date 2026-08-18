import { apiSlice as api } from "./api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    apiArticlesList: build.query<
      ApiArticlesListApiResponse,
      ApiArticlesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/articles/`,
        params: {
          mine: queryArg.mine,
          moderation_status: queryArg.moderationStatus,
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
          user: queryArg.user,
        },
      }),
    }),
    apiArticlesRetrieve: build.query<
      ApiArticlesRetrieveApiResponse,
      ApiArticlesRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/articles/${queryArg.slug}/` }),
    }),
    apiArticlesCreateCreate: build.mutation<
      ApiArticlesCreateCreateApiResponse,
      ApiArticlesCreateCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/articles/create/`,
        method: "POST",
        body: queryArg.articleCreate,
      }),
    }),
    apiCompetitionsList: build.query<
      ApiCompetitionsListApiResponse,
      ApiCompetitionsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/competitions/`,
        params: {
          mine: queryArg.mine,
          moderation_status: queryArg.moderationStatus,
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
          user: queryArg.user,
        },
      }),
    }),
    apiCompetitionsRetrieve: build.query<
      ApiCompetitionsRetrieveApiResponse,
      ApiCompetitionsRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/competitions/${queryArg.id}/` }),
    }),
    apiCompetitionsViewsCreate: build.mutation<
      ApiCompetitionsViewsCreateApiResponse,
      ApiCompetitionsViewsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/competitions/${queryArg.id}/views`,
        method: "POST",
      }),
    }),
    apiCompetitionsCreateCreate: build.mutation<
      ApiCompetitionsCreateCreateApiResponse,
      ApiCompetitionsCreateCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/competitions/create/`,
        method: "POST",
        body: queryArg.competitionCreate,
      }),
    }),
    apiCompetitionsSlugRetrieve: build.query<
      ApiCompetitionsSlugRetrieveApiResponse,
      ApiCompetitionsSlugRetrieveApiArg
    >({
      query: (queryArg) => ({
        url: `/api/competitions/slug/${queryArg.slug}/`,
      }),
    }),
    apiNewsList: build.query<ApiNewsListApiResponse, ApiNewsListApiArg>({
      query: (queryArg) => ({
        url: `/api/news/`,
        params: {
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
        },
      }),
    }),
    apiNewsRetrieve: build.query<
      ApiNewsRetrieveApiResponse,
      ApiNewsRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/news/${queryArg.slug}/` }),
    }),
    apiOrdersList: build.query<ApiOrdersListApiResponse, ApiOrdersListApiArg>({
      query: (queryArg) => ({
        url: `/api/orders/`,
        params: {
          mine: queryArg.mine,
          moderation_status: queryArg.moderationStatus,
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
          user: queryArg.user,
        },
      }),
    }),
    apiOrdersRetrieve: build.query<
      ApiOrdersRetrieveApiResponse,
      ApiOrdersRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/orders/${queryArg.id}/` }),
    }),
    apiOrdersRespondCreate: build.mutation<
      ApiOrdersRespondCreateApiResponse,
      ApiOrdersRespondCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/orders/${queryArg.id}/respond`,
        method: "POST",
      }),
    }),
    apiOrdersCreateCreate: build.mutation<
      ApiOrdersCreateCreateApiResponse,
      ApiOrdersCreateCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/orders/create/`,
        method: "POST",
        body: queryArg.orderCreate,
      }),
    }),
    apiProjectsList: build.query<
      ApiProjectsListApiResponse,
      ApiProjectsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/projects/`,
        params: {
          mine: queryArg.mine,
          moderation_status: queryArg.moderationStatus,
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
          user: queryArg.user,
        },
      }),
    }),
    apiProjectsRetrieve: build.query<
      ApiProjectsRetrieveApiResponse,
      ApiProjectsRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/projects/${queryArg.id}/` }),
    }),
    apiProjectsLikeCreate: build.mutation<
      ApiProjectsLikeCreateApiResponse,
      ApiProjectsLikeCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/projects/${queryArg.id}/like/`,
        method: "POST",
      }),
    }),
    apiProjectsViewsCreate: build.mutation<
      ApiProjectsViewsCreateApiResponse,
      ApiProjectsViewsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/projects/${queryArg.id}/views/`,
        method: "POST",
      }),
    }),
    apiProjectsCreateCreate: build.mutation<
      ApiProjectsCreateCreateApiResponse,
      ApiProjectsCreateCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/projects/create/`,
        method: "POST",
        body: queryArg.projectCreate,
      }),
    }),
    apiProjectsSpecialistList: build.query<
      ApiProjectsSpecialistListApiResponse,
      ApiProjectsSpecialistListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/projects/specialist/${queryArg.specialistId}/`,
        params: {
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
        },
      }),
    }),
    apiResumesList: build.query<
      ApiResumesListApiResponse,
      ApiResumesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/resumes/`,
        params: {
          category: queryArg.category,
          experience: queryArg.experience,
          mine: queryArg.mine,
          moderation_status: queryArg.moderationStatus,
          ordering: queryArg.ordering,
          page: queryArg.page,
          region: queryArg.region,
          salary_from: queryArg.salaryFrom,
          search: queryArg.search,
          user: queryArg.user,
        },
      }),
    }),
    apiResumesRetrieve: build.query<
      ApiResumesRetrieveApiResponse,
      ApiResumesRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/resumes/${queryArg.id}/` }),
    }),
    apiResumesCreateCreate: build.mutation<
      ApiResumesCreateCreateApiResponse,
      ApiResumesCreateCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/resumes/create/`,
        method: "POST",
        body: queryArg.resumeCreate,
      }),
    }),
    apiSpecialistsList: build.query<
      ApiSpecialistsListApiResponse,
      ApiSpecialistsListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/specialists/`,
        params: {
          category: queryArg.category,
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
        },
      }),
    }),
    apiSpecialistsLikeCreate: build.mutation<
      ApiSpecialistsLikeCreateApiResponse,
      ApiSpecialistsLikeCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/specialists/${queryArg.id}/like/`,
        method: "POST",
      }),
    }),
    apiSpecialistsViewsCreate: build.mutation<
      ApiSpecialistsViewsCreateApiResponse,
      ApiSpecialistsViewsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/specialists/${queryArg.id}/views/`,
        method: "POST",
      }),
    }),
    apiSpecialistsRetrieve: build.query<
      ApiSpecialistsRetrieveApiResponse,
      ApiSpecialistsRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/specialists/${queryArg.slug}/` }),
    }),
    apiSpecialistsTopList: build.query<
      ApiSpecialistsTopListApiResponse,
      ApiSpecialistsTopListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/specialists/top/`,
        params: {
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
        },
      }),
    }),
    apiVacanciesList: build.query<
      ApiVacanciesListApiResponse,
      ApiVacanciesListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/vacancies/`,
        params: {
          employment: queryArg.employment,
          experience: queryArg.experience,
          has_salary: queryArg.hasSalary,
          mine: queryArg.mine,
          moderation_status: queryArg.moderationStatus,
          ordering: queryArg.ordering,
          page: queryArg.page,
          payout_type: queryArg.payoutType,
          programs: queryArg.programs,
          region: queryArg.region,
          salary_from: queryArg.salaryFrom,
          salary_to: queryArg.salaryTo,
          search: queryArg.search,
          specialization: queryArg.specialization,
          user: queryArg.user,
        },
      }),
    }),
    apiVacanciesRetrieve: build.query<
      ApiVacanciesRetrieveApiResponse,
      ApiVacanciesRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/vacancies/${queryArg.id}/` }),
    }),
    apiVacanciesRespondCreate: build.mutation<
      ApiVacanciesRespondCreateApiResponse,
      ApiVacanciesRespondCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/vacancies/${queryArg.id}/respond`,
        method: "POST",
      }),
    }),
    apiVacanciesSaveCreate: build.mutation<
      ApiVacanciesSaveCreateApiResponse,
      ApiVacanciesSaveCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/vacancies/${queryArg.id}/save`,
        method: "POST",
      }),
    }),
    apiVacanciesSimilarList: build.query<
      ApiVacanciesSimilarListApiResponse,
      ApiVacanciesSimilarListApiArg
    >({
      query: (queryArg) => ({
        url: `/api/vacancies/${queryArg.id}/similar/`,
        params: {
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
        },
      }),
    }),
    apiVacanciesCreateCreate: build.mutation<
      ApiVacanciesCreateCreateApiResponse,
      ApiVacanciesCreateCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/vacancies/create/`,
        method: "POST",
        body: queryArg.vacancyCreate,
      }),
    }),
    authChangePasswordCreate: build.mutation<
      AuthChangePasswordCreateApiResponse,
      AuthChangePasswordCreateApiArg
    >({
      query: () => ({ url: `/auth/change-password`, method: "POST" }),
    }),
    authCheckCodeCreate: build.mutation<
      AuthCheckCodeCreateApiResponse,
      AuthCheckCodeCreateApiArg
    >({
      query: () => ({ url: `/auth/check-code`, method: "POST" }),
    }),
    authCheckEmailCreate: build.mutation<
      AuthCheckEmailCreateApiResponse,
      AuthCheckEmailCreateApiArg
    >({
      query: () => ({ url: `/auth/check-email`, method: "POST" }),
    }),
    authCheckPasswordCreate: build.mutation<
      AuthCheckPasswordCreateApiResponse,
      AuthCheckPasswordCreateApiArg
    >({
      query: () => ({ url: `/auth/check-password`, method: "POST" }),
    }),
    authLoginCreate: build.mutation<
      AuthLoginCreateApiResponse,
      AuthLoginCreateApiArg
    >({
      query: () => ({ url: `/auth/login`, method: "POST" }),
    }),
    authProfileRetrieve: build.query<
      AuthProfileRetrieveApiResponse,
      AuthProfileRetrieveApiArg
    >({
      query: () => ({ url: `/auth/profile` }),
    }),
    authRecoverPasswordCreate: build.mutation<
      AuthRecoverPasswordCreateApiResponse,
      AuthRecoverPasswordCreateApiArg
    >({
      query: () => ({ url: `/auth/recover-password`, method: "POST" }),
    }),
    authRefreshTokenCreate: build.mutation<
      AuthRefreshTokenCreateApiResponse,
      AuthRefreshTokenCreateApiArg
    >({
      query: () => ({ url: `/auth/refresh-token`, method: "POST" }),
    }),
    authRegisterUkCreate: build.mutation<
      AuthRegisterUkCreateApiResponse,
      AuthRegisterUkCreateApiArg
    >({
      query: () => ({ url: `/auth/register/uk`, method: "POST" }),
    }),
    authRequestResetPasswordUkCreate: build.mutation<
      AuthRequestResetPasswordUkCreateApiResponse,
      AuthRequestResetPasswordUkCreateApiArg
    >({
      query: () => ({ url: `/auth/request-reset-password/uk`, method: "POST" }),
    }),
    editProfileCreate: build.mutation<
      EditProfileCreateApiResponse,
      EditProfileCreateApiArg
    >({
      query: () => ({ url: `/edit-profile`, method: "POST" }),
    }),
    eventsCreate: build.mutation<EventsCreateApiResponse, EventsCreateApiArg>({
      query: () => ({ url: `/events`, method: "POST" }),
    }),
    usersChangeEmailCreate: build.mutation<
      UsersChangeEmailCreateApiResponse,
      UsersChangeEmailCreateApiArg
    >({
      query: () => ({ url: `/users/change-email`, method: "POST" }),
    }),
    usersRestoreCreate: build.mutation<
      UsersRestoreCreateApiResponse,
      UsersRestoreCreateApiArg
    >({
      query: () => ({ url: `/users/restore`, method: "POST" }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedApi };
export type ApiArticlesListApiResponse =
  /** status 200  */ PaginatedArticleListListRead;
export type ApiArticlesListApiArg = {
  /** Только мои */
  mine?: boolean;
  /** Статус модерации
    
    * `pending` - На модерации
    * `approved` - Одобрено
    * `rejected` - Отклонено */
  moderationStatus?: "approved" | "pending" | "rejected";
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
  /** ID автора */
  user?: number;
};
export type ApiArticlesRetrieveApiResponse =
  /** status 200  */ ArticleDetailRead;
export type ApiArticlesRetrieveApiArg = {
  slug: string;
};
export type ApiArticlesCreateCreateApiResponse =
  /** status 201  */ ArticleCreate;
export type ApiArticlesCreateCreateApiArg = {
  articleCreate: ArticleCreate;
};
export type ApiCompetitionsListApiResponse =
  /** status 200  */ PaginatedCompetitionListListRead;
export type ApiCompetitionsListApiArg = {
  /** Только мои */
  mine?: boolean;
  /** Статус модерации
    
    * `pending` - На модерации
    * `approved` - Одобрено
    * `rejected` - Отклонено */
  moderationStatus?: "approved" | "pending" | "rejected";
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
  /** ID автора */
  user?: number;
};
export type ApiCompetitionsRetrieveApiResponse =
  /** status 200  */ CompetitionDetailRead;
export type ApiCompetitionsRetrieveApiArg = {
  id: number;
};
export type ApiCompetitionsViewsCreateApiResponse = unknown;
export type ApiCompetitionsViewsCreateApiArg = {
  id: number;
};
export type ApiCompetitionsCreateCreateApiResponse =
  /** status 201  */ CompetitionCreateRead;
export type ApiCompetitionsCreateCreateApiArg = {
  competitionCreate: CompetitionCreate;
};
export type ApiCompetitionsSlugRetrieveApiResponse =
  /** status 200  */ CompetitionDetailRead;
export type ApiCompetitionsSlugRetrieveApiArg = {
  slug: string;
};
export type ApiNewsListApiResponse =
  /** status 200  */ PaginatedNewsListListRead;
export type ApiNewsListApiArg = {
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
};
export type ApiNewsRetrieveApiResponse = /** status 200  */ NewsDetailRead;
export type ApiNewsRetrieveApiArg = {
  slug: string;
};
export type ApiOrdersListApiResponse =
  /** status 200  */ PaginatedOrderListListRead;
export type ApiOrdersListApiArg = {
  /** Только мои */
  mine?: boolean;
  /** Статус модерации
    
    * `pending` - На модерации
    * `approved` - Одобрено
    * `rejected` - Отклонено */
  moderationStatus?: "approved" | "pending" | "rejected";
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
  /** ID автора */
  user?: number;
};
export type ApiOrdersRetrieveApiResponse = /** status 200  */ OrderDetailRead;
export type ApiOrdersRetrieveApiArg = {
  id: number;
};
export type ApiOrdersRespondCreateApiResponse = unknown;
export type ApiOrdersRespondCreateApiArg = {
  id: number;
};
export type ApiOrdersCreateCreateApiResponse = /** status 201  */ OrderCreate;
export type ApiOrdersCreateCreateApiArg = {
  orderCreate: OrderCreate;
};
export type ApiProjectsListApiResponse =
  /** status 200  */ PaginatedProjectListListRead;
export type ApiProjectsListApiArg = {
  /** Только мои */
  mine?: boolean;
  /** Статус модерации
    
    * `pending` - На модерации
    * `approved` - Одобрено
    * `rejected` - Отклонено */
  moderationStatus?: "approved" | "pending" | "rejected";
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
  /** ID автора */
  user?: number;
};
export type ApiProjectsRetrieveApiResponse =
  /** status 200  */ ProjectDetailRead;
export type ApiProjectsRetrieveApiArg = {
  id: number;
};
export type ApiProjectsLikeCreateApiResponse = unknown;
export type ApiProjectsLikeCreateApiArg = {
  id: number;
};
export type ApiProjectsViewsCreateApiResponse = unknown;
export type ApiProjectsViewsCreateApiArg = {
  id: number;
};
export type ApiProjectsCreateCreateApiResponse =
  /** status 201  */ ProjectCreate;
export type ApiProjectsCreateCreateApiArg = {
  projectCreate: ProjectCreateWrite;
};
export type ApiProjectsSpecialistListApiResponse =
  /** status 200  */ PaginatedProjectListListRead;
export type ApiProjectsSpecialistListApiArg = {
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
  specialistId: number;
};
export type ApiResumesListApiResponse =
  /** status 200  */ PaginatedResumeListListRead;
export type ApiResumesListApiArg = {
  category?: string;
  experience?: string;
  /** Только мои */
  mine?: boolean;
  /** Статус модерации
    
    * `pending` - На модерации
    * `approved` - Одобрено
    * `rejected` - Отклонено */
  moderationStatus?: "approved" | "pending" | "rejected";
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  region?: string;
  salaryFrom?: number;
  /** A search term. */
  search?: string;
  /** ID автора */
  user?: number;
};
export type ApiResumesRetrieveApiResponse = /** status 200  */ ResumeDetailRead;
export type ApiResumesRetrieveApiArg = {
  id: number;
};
export type ApiResumesCreateCreateApiResponse =
  /** status 201  */ ResumeCreateRead;
export type ApiResumesCreateCreateApiArg = {
  resumeCreate: ResumeCreate;
};
export type ApiSpecialistsListApiResponse =
  /** status 200  */ PaginatedSpecialistListListRead;
export type ApiSpecialistsListApiArg = {
  category?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
};
export type ApiSpecialistsLikeCreateApiResponse = unknown;
export type ApiSpecialistsLikeCreateApiArg = {
  id: number;
};
export type ApiSpecialistsViewsCreateApiResponse = unknown;
export type ApiSpecialistsViewsCreateApiArg = {
  id: number;
};
export type ApiSpecialistsRetrieveApiResponse =
  /** status 200  */ SpecialistDetailRead;
export type ApiSpecialistsRetrieveApiArg = {
  slug: string;
};
export type ApiSpecialistsTopListApiResponse =
  /** status 200  */ PaginatedSpecialistListListRead;
export type ApiSpecialistsTopListApiArg = {
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
};
export type ApiVacanciesListApiResponse =
  /** status 200  */ PaginatedVacancyListListRead;
export type ApiVacanciesListApiArg = {
  employment?: string;
  experience?: string;
  hasSalary?: boolean;
  /** Только мои */
  mine?: boolean;
  /** Статус модерации
    
    * `pending` - На модерации
    * `approved` - Одобрено
    * `rejected` - Отклонено */
  moderationStatus?: "approved" | "pending" | "rejected";
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  payoutType?: string;
  programs?: string;
  region?: string;
  salaryFrom?: number;
  salaryTo?: number;
  /** A search term. */
  search?: string;
  specialization?: string;
  /** ID автора */
  user?: number;
};
export type ApiVacanciesRetrieveApiResponse =
  /** status 200  */ VacancyDetailRead;
export type ApiVacanciesRetrieveApiArg = {
  id: number;
};
export type ApiVacanciesRespondCreateApiResponse = unknown;
export type ApiVacanciesRespondCreateApiArg = {
  id: number;
};
export type ApiVacanciesSaveCreateApiResponse = unknown;
export type ApiVacanciesSaveCreateApiArg = {
  id: number;
};
export type ApiVacanciesSimilarListApiResponse =
  /** status 200  */ PaginatedVacancyListListRead;
export type ApiVacanciesSimilarListApiArg = {
  id: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
};
export type ApiVacanciesCreateCreateApiResponse =
  /** status 201  */ VacancyCreateRead;
export type ApiVacanciesCreateCreateApiArg = {
  vacancyCreate: VacancyCreate;
};
export type AuthChangePasswordCreateApiResponse = unknown;
export type AuthChangePasswordCreateApiArg = void;
export type AuthCheckCodeCreateApiResponse = unknown;
export type AuthCheckCodeCreateApiArg = void;
export type AuthCheckEmailCreateApiResponse = unknown;
export type AuthCheckEmailCreateApiArg = void;
export type AuthCheckPasswordCreateApiResponse = unknown;
export type AuthCheckPasswordCreateApiArg = void;
export type AuthLoginCreateApiResponse = unknown;
export type AuthLoginCreateApiArg = void;
export type AuthProfileRetrieveApiResponse = unknown;
export type AuthProfileRetrieveApiArg = void;
export type AuthRecoverPasswordCreateApiResponse = unknown;
export type AuthRecoverPasswordCreateApiArg = void;
export type AuthRefreshTokenCreateApiResponse = unknown;
export type AuthRefreshTokenCreateApiArg = void;
export type AuthRegisterUkCreateApiResponse = unknown;
export type AuthRegisterUkCreateApiArg = void;
export type AuthRequestResetPasswordUkCreateApiResponse = unknown;
export type AuthRequestResetPasswordUkCreateApiArg = void;
export type EditProfileCreateApiResponse = unknown;
export type EditProfileCreateApiArg = void;
export type EventsCreateApiResponse = unknown;
export type EventsCreateApiArg = void;
export type UsersChangeEmailCreateApiResponse = unknown;
export type UsersChangeEmailCreateApiArg = void;
export type UsersRestoreCreateApiResponse = unknown;
export type UsersRestoreCreateApiArg = void;
export type ContentModeEnum = "editor" | "docx";
export type ArticleList = {
  title: string;
  slug?: string;
  contentMode?: ContentModeEnum;
  shortDescription?: string;
  views?: number;
};
export type ModerationStatusEnum = "pending" | "approved" | "rejected";
export type ArticleListRead = {
  id: number;
  title: string;
  slug?: string;
  contentMode?: ContentModeEnum;
  previewImage: string;
  shortDescription?: string;
  authorName: string;
  views?: number;
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type PaginatedArticleListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ArticleList[];
};
export type PaginatedArticleListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ArticleListRead[];
};
export type ArticleDetail = {
  title: string;
  slug?: string;
  contentMode?: ContentModeEnum;
  shortDescription?: string;
  biography?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  contentHtml?: string;
  isPublished?: boolean;
  views?: number;
};
export type TypeEnum = "text" | "image" | "video" | "gallery";
export type ArticleBlock = {
  type: TypeEnum;
  content?: string;
  altText?: string;
  order?: number;
};
export type BlockImage = {
  order?: number;
};
export type BlockImageRead = {
  id: number;
  image: string;
  order?: number;
};
export type ArticleBlockRead = {
  id: number;
  type: TypeEnum;
  content?: string;
  altText?: string;
  order?: number;
  images: BlockImageRead[];
};
export type ArticleDetailRead = {
  id: number;
  title: string;
  slug?: string;
  contentMode?: ContentModeEnum;
  previewImage: string;
  shortDescription?: string;
  biography?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  contentHtml?: string;
  blocks: ArticleBlockRead[];
  isPublished?: boolean;
  authorName: string;
  views?: number;
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type ArticleCreate = {
  title: string;
  previewImage?: string | null;
  shortDescription?: string;
  wordFile?: string | null;
  isPublished?: boolean;
  biography?: string;
  contentMode?: ContentModeEnum;
};
export type CompetitionList = {
  slug: string;
  title: string;
  shortDescription?: string;
  image?: string | null;
  country?: string;
  city?: string;
  prize?: string;
  organizer?: string;
  startRegistration?: string | null;
  endRegistration?: string | null;
  submissionDeadline?: string | null;
  views?: number;
  participantsCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
};
export type CompetitionListRead = {
  id: number;
  slug: string;
  title: string;
  shortDescription?: string;
  image?: string | null;
  country?: string;
  city?: string;
  prize?: string;
  organizer?: string;
  startRegistration?: string | null;
  endRegistration?: string | null;
  submissionDeadline?: string | null;
  views?: number;
  participantsCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type PaginatedCompetitionListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: CompetitionList[];
};
export type PaginatedCompetitionListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: CompetitionListRead[];
};
export type CompetitionDetail = {
  moderationStatus?: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment?: string;
  moderatedAt?: string | null;
  slug: string;
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  shortDescription?: string;
  image?: string | null;
  openFor?: any;
  country?: string;
  city?: string;
  registrationFee?: string;
  prize?: string;
  organizer?: string;
  organizerLink?: string;
  startRegistration?: string | null;
  endRegistration?: string | null;
  submissionDeadline?: string | null;
  resultsAnnouncement?: string | null;
  tasks?: any;
  conditions?: any;
  projectComposition?: any;
  evaluationCriteria?: any;
  views?: number;
  participantsCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  moderatedBy?: number | null;
  createdBy?: number | null;
};
export type CompetitionDetailRead = {
  id: number;
  moderationStatus?: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment?: string;
  moderatedAt?: string | null;
  slug: string;
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  shortDescription?: string;
  image?: string | null;
  openFor?: any;
  country?: string;
  city?: string;
  registrationFee?: string;
  prize?: string;
  organizer?: string;
  organizerLink?: string;
  startRegistration?: string | null;
  endRegistration?: string | null;
  submissionDeadline?: string | null;
  resultsAnnouncement?: string | null;
  tasks?: any;
  conditions?: any;
  projectComposition?: any;
  evaluationCriteria?: any;
  views?: number;
  participantsCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  moderatedBy?: number | null;
  createdBy?: number | null;
};
export type CompetitionCreate = {
  slug: string;
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  shortDescription?: string;
  image?: string | null;
  openFor?: any;
  country?: string;
  city?: string;
  registrationFee?: string;
  prize?: string;
  organizer?: string;
  organizerLink?: string;
  startRegistration?: string | null;
  endRegistration?: string | null;
  submissionDeadline?: string | null;
  resultsAnnouncement?: string | null;
  tasks?: any;
  conditions?: any;
  projectComposition?: any;
  evaluationCriteria?: any;
  isActive?: boolean;
  isFeatured?: boolean;
};
export type CompetitionCreateRead = {
  id: number;
  slug: string;
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  shortDescription?: string;
  image?: string | null;
  openFor?: any;
  country?: string;
  city?: string;
  registrationFee?: string;
  prize?: string;
  organizer?: string;
  organizerLink?: string;
  startRegistration?: string | null;
  endRegistration?: string | null;
  submissionDeadline?: string | null;
  resultsAnnouncement?: string | null;
  tasks?: any;
  conditions?: any;
  projectComposition?: any;
  evaluationCriteria?: any;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
};
export type NewsList = {
  title: string;
  slug: string;
  previewImage?: string | null;
  shortDescription?: string;
  views?: number;
};
export type NewsListRead = {
  id: number;
  title: string;
  slug: string;
  previewImage?: string | null;
  shortDescription?: string;
  views?: number;
  createdAt: string;
};
export type PaginatedNewsListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: NewsList[];
};
export type PaginatedNewsListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: NewsListRead[];
};
export type NewsDetail = {
  title: string;
  slug: string;
  previewImage?: string | null;
  shortDescription?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  content?: string;
  isPublished?: boolean;
  views?: number;
};
export type NewsDetailRead = {
  id: number;
  title: string;
  slug: string;
  previewImage?: string | null;
  shortDescription?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  content?: string;
  isPublished?: boolean;
  views?: number;
  createdAt: string;
};
export type OrderList = {
  title: string;
  budget?: number;
  propertyType?: any;
  software?: any;
};
export type OrderListRead = {
  id: number;
  title: string;
  budget?: number;
  propertyType?: any;
  software?: any;
  createdByName: string;
  responsesCount: string;
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type PaginatedOrderListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: OrderList[];
};
export type PaginatedOrderListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: OrderListRead[];
};
export type OrderDetail = {
  title: string;
  budget?: number;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  propertyType?: any;
  software?: any;
};
export type OrderDetailRead = {
  id: number;
  title: string;
  budget?: number;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  propertyType?: any;
  software?: any;
  createdByName: string;
  responsesCount: string;
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type OrderCreate = {
  title: string;
  budget?: number;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  propertyType?: any;
  software?: any;
};
export type ProjectList = {
  title: string;
  previewImage?: string | null;
  views?: number;
  likes?: number;
};
export type ProjectListRead = {
  id: number;
  title: string;
  previewImage?: string | null;
  specialistName: string;
  specialistSlug: string;
  views?: number;
  likes?: number;
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type PaginatedProjectListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ProjectList[];
};
export type PaginatedProjectListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ProjectListRead[];
};
export type ProjectDetail = {
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  previewImage?: string | null;
  views?: number;
  likes?: number;
};
export type ProjectImage = {
  image: string;
  isPreview?: boolean;
  alt?: string;
};
export type ProjectImageRead = {
  id: number;
  image: string;
  isPreview?: boolean;
  alt?: string;
};
export type ProjectDetailRead = {
  id: number;
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  previewImage?: string | null;
  specialistId: number;
  specialistName: string;
  specialistSlug: string;
  images: ProjectImageRead[];
  views?: number;
  likes?: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type ProjectCreate = {
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  previewImage?: string | null;
};
export type ProjectCreateWrite = {
  title: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description: string;
  previewImage?: string | null;
  images?: string[];
};
export type ResumeList = {
  name: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  region?: string;
  avatar?: string | null;
  keySkills?: any;
};
export type ResumeListRead = {
  id: number;
  name: string;
  userName: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  region?: string;
  avatar?: string | null;
  keySkills?: any;
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type PaginatedResumeListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ResumeList[];
};
export type PaginatedResumeListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ResumeListRead[];
};
export type ResumeDetail = {
  name: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  about?: string;
  software?: any;
  employmentType?: any;
  region?: string;
  avatar?: string | null;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  socialLinks?: any;
  keySkills?: any;
};
export type WorkExperience = {
  company: string;
  position?: string;
  startDate: string;
  endDate: string;
  duties?: any;
  achievement?: string;
};
export type WorkExperienceRead = {
  id: number;
  company: string;
  position?: string;
  startDate: string;
  endDate: string;
  duties?: any;
  achievement?: string;
};
export type ResumeDetailRead = {
  id: number;
  name: string;
  userName: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  about?: string;
  software?: any;
  employmentType?: any;
  region?: string;
  avatar?: string | null;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  socialLinks?: any;
  keySkills?: any;
  workExperience: WorkExperienceRead[];
  createdAt: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type ResumeCreate = {
  workExperience?: WorkExperience[];
  name: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  about?: string;
  software?: any;
  employmentType?: any;
  region?: string;
  avatar?: string | null;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  socialLinks?: any;
  keySkills?: any;
};
export type ResumeCreateRead = {
  id: number;
  workExperience?: WorkExperienceRead[];
  name: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  about?: string;
  software?: any;
  employmentType?: any;
  region?: string;
  avatar?: string | null;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  socialLinks?: any;
  keySkills?: any;
  createdAt: string;
};
export type CategoryEnum =
  | "architects"
  | "engineers"
  | "interior-designers"
  | "visualizers";
export type SpecialistList = {
  slug: string;
  category: CategoryEnum;
  categoryName?: string;
  firm?: string;
  rating?: string;
  views?: number;
  likes?: number;
};
export type SpecialistListRead = {
  id: number;
  slug: string;
  name: string;
  avatar: string;
  category: CategoryEnum;
  categoryName?: string;
  firm?: string;
  specialization: string;
  experienceYears: number;
  rating?: string;
  views?: number;
  likes?: number;
  totalLikes: number;
};
export type PaginatedSpecialistListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: SpecialistList[];
};
export type PaginatedSpecialistListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: SpecialistListRead[];
};
export type SpecialistDetail = {
  slug: string;
  category: CategoryEnum;
  categoryName?: string;
  firm?: string;
  description?: string;
  rating?: string;
  views?: number;
  likes?: number;
};
export type SpecialistDetailRead = {
  id: number;
  slug: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
  position: string;
  category: CategoryEnum;
  categoryName?: string;
  firm?: string;
  description?: string;
  specialization: string;
  experienceYears: number;
  regionFrom: any;
  rating?: string;
  views?: number;
  likes?: number;
  isLiked: boolean;
  instagram: string;
  telegram: string;
  linkedin: string;
  behance: string;
  website: string;
  projects: string;
};
export type SpecializationEnum =
  | "architects"
  | "engineers"
  | "interior-designers"
  | "visualizers";
export type BlankEnum = "";
export type VacancyList = {
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  workTags?: any;
  companyName: string;
  companyType?: string;
  companyLogo?: string | null;
  companyAddress?: string;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  workFormat?: string;
  specialization?: SpecializationEnum | BlankEnum;
  programs?: any;
  payoutType?: string;
  viewsCount?: number;
};
export type VacancyListRead = {
  id: number;
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  workTags?: any;
  companyName: string;
  companyType?: string;
  companyLogo?: string | null;
  companyAddress?: string;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  workFormat?: string;
  specialization?: SpecializationEnum | BlankEnum;
  programs?: any;
  payoutType?: string;
  viewsCount?: number;
  createdAt: string;
  isSaved: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type PaginatedVacancyListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: VacancyList[];
};
export type PaginatedVacancyListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: VacancyListRead[];
};
export type VacancyDetail = {
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  workTags?: any;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  keySkills?: any;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  workingHours?: string;
  workFormat?: string;
  specialization?: SpecializationEnum | BlankEnum;
  programs?: any;
  payoutType?: string;
  companyName: string;
  companyType?: string;
  companyLogo?: string | null;
  companyAddress?: string;
  companyWebsite?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyDescription?: string;
  publisherName?: string;
  publisherPosition?: string;
  publisherPhone?: string;
  publisherEmail?: string;
  viewsCount?: number;
};
export type VacancyDetailRead = {
  id: number;
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  workTags?: any;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  keySkills?: any;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  workingHours?: string;
  workFormat?: string;
  specialization?: SpecializationEnum | BlankEnum;
  programs?: any;
  payoutType?: string;
  companyName: string;
  companyType?: string;
  companyLogo?: string | null;
  companyAddress?: string;
  companyWebsite?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyDescription?: string;
  publisherName?: string;
  publisherPosition?: string;
  publisherPhone?: string;
  publisherEmail?: string;
  viewsCount?: number;
  createdAt: string;
  isSaved: string;
  responsesCount: string;
  moderationStatus: ModerationStatusEnum;
  /** Причина отклонения. Её видит автор материала. */
  moderationComment: string;
};
export type VacancyCreate = {
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  workTags?: any;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  keySkills?: any;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  workingHours?: string;
  workFormat?: string;
  specialization?: SpecializationEnum | BlankEnum;
  programs?: any;
  payoutType?: string;
  companyName: string;
  companyType?: string;
  companyLogo?: string | null;
  companyAddress?: string;
  companyWebsite?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyDescription?: string;
  publisherName?: string;
  publisherPosition?: string;
  publisherPhone?: string;
  publisherEmail?: string;
};
export type VacancyCreateRead = {
  id: number;
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  workTags?: any;
  /** Фото-галерею или слайдер можно вставить кнопкой «Галерея» на панели редактора. Двойной клик по вставленному блоку открывает его на редактирование. */
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  keySkills?: any;
  workPlace?: string;
  employment?: string;
  schedule?: string;
  workingHours?: string;
  workFormat?: string;
  specialization?: SpecializationEnum | BlankEnum;
  programs?: any;
  payoutType?: string;
  companyName: string;
  companyType?: string;
  companyLogo?: string | null;
  companyAddress?: string;
  companyWebsite?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyDescription?: string;
  publisherName?: string;
  publisherPosition?: string;
  publisherPhone?: string;
  publisherEmail?: string;
};
export const {
  useApiArticlesListQuery,
  useApiArticlesRetrieveQuery,
  useApiArticlesCreateCreateMutation,
  useApiCompetitionsListQuery,
  useApiCompetitionsRetrieveQuery,
  useApiCompetitionsViewsCreateMutation,
  useApiCompetitionsCreateCreateMutation,
  useApiCompetitionsSlugRetrieveQuery,
  useApiNewsListQuery,
  useApiNewsRetrieveQuery,
  useApiOrdersListQuery,
  useApiOrdersRetrieveQuery,
  useApiOrdersRespondCreateMutation,
  useApiOrdersCreateCreateMutation,
  useApiProjectsListQuery,
  useApiProjectsRetrieveQuery,
  useApiProjectsLikeCreateMutation,
  useApiProjectsViewsCreateMutation,
  useApiProjectsCreateCreateMutation,
  useApiProjectsSpecialistListQuery,
  useApiResumesListQuery,
  useApiResumesRetrieveQuery,
  useApiResumesCreateCreateMutation,
  useApiSpecialistsListQuery,
  useApiSpecialistsLikeCreateMutation,
  useApiSpecialistsViewsCreateMutation,
  useApiSpecialistsRetrieveQuery,
  useApiSpecialistsTopListQuery,
  useApiVacanciesListQuery,
  useApiVacanciesRetrieveQuery,
  useApiVacanciesRespondCreateMutation,
  useApiVacanciesSaveCreateMutation,
  useApiVacanciesSimilarListQuery,
  useApiVacanciesCreateCreateMutation,
  useAuthChangePasswordCreateMutation,
  useAuthCheckCodeCreateMutation,
  useAuthCheckEmailCreateMutation,
  useAuthCheckPasswordCreateMutation,
  useAuthLoginCreateMutation,
  useAuthProfileRetrieveQuery,
  useAuthRecoverPasswordCreateMutation,
  useAuthRefreshTokenCreateMutation,
  useAuthRegisterUkCreateMutation,
  useAuthRequestResetPasswordUkCreateMutation,
  useEditProfileCreateMutation,
  useEventsCreateMutation,
  useUsersChangeEmailCreateMutation,
  useUsersRestoreCreateMutation,
} = injectedRtkApi;
