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
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
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
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
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
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
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
          ordering: queryArg.ordering,
          page: queryArg.page,
          search: queryArg.search,
        },
      }),
    }),
    apiProjectsRetrieve: build.query<
      ApiProjectsRetrieveApiResponse,
      ApiProjectsRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/api/projects/${queryArg.id}/` }),
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
          ordering: queryArg.ordering,
          page: queryArg.page,
          region: queryArg.region,
          salary_from: queryArg.salaryFrom,
          search: queryArg.search,
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
          experience: queryArg.experience,
          ordering: queryArg.ordering,
          page: queryArg.page,
          region: queryArg.region,
          salary_from: queryArg.salaryFrom,
          salary_to: queryArg.salaryTo,
          search: queryArg.search,
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
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
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
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
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
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
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
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  /** A search term. */
  search?: string;
};
export type ApiProjectsRetrieveApiResponse =
  /** status 200  */ ProjectDetailRead;
export type ApiProjectsRetrieveApiArg = {
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
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  region?: string;
  salaryFrom?: number;
  /** A search term. */
  search?: string;
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
  experience?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
  region?: string;
  salaryFrom?: number;
  salaryTo?: number;
  /** A search term. */
  search?: string;
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
export type ArticleList = {
  title: string;
  slug: string;
  preview_image?: string | null;
  short_description?: string;
  views?: number;
};
export type ArticleListRead = {
  id: number;
  title: string;
  slug: string;
  preview_image?: string | null;
  short_description?: string;
  author_name: string;
  views?: number;
  created_at: string;
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
  slug: string;
  preview_image?: string | null;
  short_description?: string;
  content_html?: string;
  is_published?: boolean;
  views?: number;
};
export type ArticleDetailRead = {
  id: number;
  title: string;
  slug: string;
  preview_image?: string | null;
  short_description?: string;
  content_html?: string;
  is_published?: boolean;
  author_name: string;
  views?: number;
  created_at: string;
};
export type ArticleCreate = {
  title: string;
  preview_image?: string | null;
  short_description?: string;
  word_file?: string | null;
  is_published?: boolean;
};
export type CompetitionList = {
  slug: string;
  title: string;
  short_description?: string;
  image?: string | null;
  country?: string;
  city?: string;
  prize?: string;
  organizer?: string;
  start_registration?: string | null;
  end_registration?: string | null;
  submission_deadline?: string | null;
  views?: number;
  participants_count?: number;
  is_active?: boolean;
  is_featured?: boolean;
};
export type CompetitionListRead = {
  id: number;
  slug: string;
  title: string;
  short_description?: string;
  image?: string | null;
  country?: string;
  city?: string;
  prize?: string;
  organizer?: string;
  start_registration?: string | null;
  end_registration?: string | null;
  submission_deadline?: string | null;
  views?: number;
  participants_count?: number;
  is_active?: boolean;
  is_featured?: boolean;
  created_at: string;
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
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  image?: string | null;
  open_for?: any;
  country?: string;
  city?: string;
  registration_fee?: string;
  prize?: string;
  organizer?: string;
  organizer_link?: string;
  start_registration?: string | null;
  end_registration?: string | null;
  submission_deadline?: string | null;
  results_announcement?: string | null;
  tasks?: any;
  conditions?: any;
  project_composition?: any;
  evaluation_criteria?: any;
  views?: number;
  participants_count?: number;
  is_active?: boolean;
  is_featured?: boolean;
  created_by?: number | null;
};
export type CompetitionDetailRead = {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  image?: string | null;
  open_for?: any;
  country?: string;
  city?: string;
  registration_fee?: string;
  prize?: string;
  organizer?: string;
  organizer_link?: string;
  start_registration?: string | null;
  end_registration?: string | null;
  submission_deadline?: string | null;
  results_announcement?: string | null;
  tasks?: any;
  conditions?: any;
  project_composition?: any;
  evaluation_criteria?: any;
  views?: number;
  participants_count?: number;
  is_active?: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  created_by?: number | null;
};
export type CompetitionCreate = {
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  image?: string | null;
  open_for?: any;
  country?: string;
  city?: string;
  registration_fee?: string;
  prize?: string;
  organizer?: string;
  organizer_link?: string;
  start_registration?: string | null;
  end_registration?: string | null;
  submission_deadline?: string | null;
  results_announcement?: string | null;
  tasks?: any;
  conditions?: any;
  project_composition?: any;
  evaluation_criteria?: any;
  is_active?: boolean;
  is_featured?: boolean;
};
export type CompetitionCreateRead = {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  image?: string | null;
  open_for?: any;
  country?: string;
  city?: string;
  registration_fee?: string;
  prize?: string;
  organizer?: string;
  organizer_link?: string;
  start_registration?: string | null;
  end_registration?: string | null;
  submission_deadline?: string | null;
  results_announcement?: string | null;
  tasks?: any;
  conditions?: any;
  project_composition?: any;
  evaluation_criteria?: any;
  is_active?: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
};
export type NewsList = {
  title: string;
  slug: string;
  preview_image?: string | null;
  short_description?: string;
  views?: number;
};
export type NewsListRead = {
  id: number;
  title: string;
  slug: string;
  preview_image?: string | null;
  short_description?: string;
  views?: number;
  created_at: string;
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
  preview_image?: string | null;
  short_description?: string;
  content?: string;
  is_published?: boolean;
  views?: number;
};
export type NewsDetailRead = {
  id: number;
  title: string;
  slug: string;
  preview_image?: string | null;
  short_description?: string;
  content?: string;
  is_published?: boolean;
  views?: number;
  created_at: string;
};
export type OrderList = {
  title: string;
  budget?: number;
  property_type?: any;
  software?: any;
};
export type OrderListRead = {
  id: number;
  title: string;
  budget?: number;
  property_type?: any;
  software?: any;
  created_by_name: string;
  responses_count: string;
  created_at: string;
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
  description: string;
  property_type?: any;
  software?: any;
};
export type OrderDetailRead = {
  id: number;
  title: string;
  budget?: number;
  description: string;
  property_type?: any;
  software?: any;
  created_by_name: string;
  responses_count: string;
  created_at: string;
};
export type OrderCreate = {
  title: string;
  budget?: number;
  description: string;
  property_type?: any;
  software?: any;
};
export type ProjectList = {
  title: string;
  preview_image?: string | null;
  views?: number;
  likes?: number;
};
export type ProjectListRead = {
  id: number;
  title: string;
  preview_image?: string | null;
  specialist_name: string;
  specialist_slug: string;
  views?: number;
  likes?: number;
  created_at: string;
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
  description: string;
  preview_image?: string | null;
  views?: number;
  likes?: number;
};
export type ProjectImage = {
  image: string;
  is_preview?: boolean;
  alt?: string;
};
export type ProjectImageRead = {
  id: number;
  image: string;
  is_preview?: boolean;
  alt?: string;
};
export type ProjectDetailRead = {
  id: number;
  title: string;
  description: string;
  preview_image?: string | null;
  specialist_id: number;
  specialist_name: string;
  specialist_slug: string;
  images: ProjectImageRead[];
  views?: number;
  likes?: number;
  created_at: string;
  updated_at: string;
};
export type ProjectCreate = {
  title: string;
  description: string;
  preview_image?: string | null;
};
export type ProjectCreateWrite = {
  title: string;
  description: string;
  preview_image?: string | null;
  images?: string[];
};
export type ResumeList = {
  name: string;
  salary_from?: number;
  salary_to?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  region?: string;
  avatar?: string | null;
  key_skills?: any;
};
export type ResumeListRead = {
  id: number;
  name: string;
  user_name: string;
  salary_from?: number;
  salary_to?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  region?: string;
  avatar?: string | null;
  key_skills?: any;
  created_at: string;
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
  salary_from?: number;
  salary_to?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  about?: string;
  software?: any;
  employment_type?: any;
  region?: string;
  avatar?: string | null;
  work_place?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  social_links?: any;
  key_skills?: any;
};
export type WorkExperience = {
  company: string;
  position?: string;
  start_date: string;
  end_date: string;
  duties?: any;
  achievement?: string;
};
export type WorkExperienceRead = {
  id: number;
  company: string;
  position?: string;
  start_date: string;
  end_date: string;
  duties?: any;
  achievement?: string;
};
export type ResumeDetailRead = {
  id: number;
  name: string;
  user_name: string;
  salary_from?: number;
  salary_to?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  about?: string;
  software?: any;
  employment_type?: any;
  region?: string;
  avatar?: string | null;
  work_place?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  social_links?: any;
  key_skills?: any;
  work_experience: WorkExperienceRead[];
  created_at: string;
};
export type ResumeCreate = {
  work_experience?: WorkExperience[];
  name: string;
  salary_from?: number;
  salary_to?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  about?: string;
  software?: any;
  employment_type?: any;
  region?: string;
  avatar?: string | null;
  work_place?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  social_links?: any;
  key_skills?: any;
};
export type ResumeCreateRead = {
  id: number;
  work_experience?: WorkExperienceRead[];
  name: string;
  salary_from?: number;
  salary_to?: number;
  experience?: string;
  specialization?: any;
  category?: string;
  description?: string;
  about?: string;
  software?: any;
  employment_type?: any;
  region?: string;
  avatar?: string | null;
  work_place?: string;
  employment?: string;
  schedule?: string;
  phone?: string;
  email?: string;
  social_links?: any;
  key_skills?: any;
  created_at: string;
};
export type CategoryEnum =
  | "architects"
  | "engineers"
  | "interior-designers"
  | "visualizers";
export type SpecialistList = {
  slug: string;
  category: CategoryEnum;
  category_name?: string;
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
  category_name?: string;
  firm?: string;
  specialization: string;
  experience_years: number;
  rating?: string;
  views?: number;
  likes?: number;
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
  category_name?: string;
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
  category_name?: string;
  firm?: string;
  description?: string;
  specialization: string;
  experience_years: number;
  region_from: any;
  rating?: string;
  views?: number;
  likes?: number;
  instagram: string;
  telegram: string;
  linkedin: string;
  behance: string;
  website: string;
  projects: string;
};
export type VacancyList = {
  title: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  work_tags?: any;
  company_name: string;
  company_logo?: string | null;
  company_address?: string;
  work_place?: string;
  employment?: string;
  schedule?: string;
  work_format?: string;
  views_count?: number;
};
export type VacancyListRead = {
  id: number;
  title: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  work_tags?: any;
  company_name: string;
  company_logo?: string | null;
  company_address?: string;
  work_place?: string;
  employment?: string;
  schedule?: string;
  work_format?: string;
  views_count?: number;
  created_at: string;
  is_saved: string;
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
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  work_tags?: any;
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  key_skills?: any;
  work_place?: string;
  employment?: string;
  schedule?: string;
  working_hours?: string;
  work_format?: string;
  company_name: string;
  company_logo?: string | null;
  company_address?: string;
  company_website?: string;
  company_phone?: string;
  company_email?: string;
  company_description?: string;
  publisher_name?: string;
  publisher_position?: string;
  publisher_phone?: string;
  publisher_email?: string;
  views_count?: number;
};
export type VacancyDetailRead = {
  id: number;
  title: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  work_tags?: any;
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  key_skills?: any;
  work_place?: string;
  employment?: string;
  schedule?: string;
  working_hours?: string;
  work_format?: string;
  company_name: string;
  company_logo?: string | null;
  company_address?: string;
  company_website?: string;
  company_phone?: string;
  company_email?: string;
  company_description?: string;
  publisher_name?: string;
  publisher_position?: string;
  publisher_phone?: string;
  publisher_email?: string;
  views_count?: number;
  created_at: string;
  is_saved: string;
  responses_count: string;
};
export type VacancyCreate = {
  title: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  work_tags?: any;
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  key_skills?: any;
  work_place?: string;
  employment?: string;
  schedule?: string;
  working_hours?: string;
  work_format?: string;
  company_name: string;
  company_logo?: string | null;
  company_address?: string;
  company_website?: string;
  company_phone?: string;
  company_email?: string;
  company_description?: string;
  publisher_name?: string;
  publisher_position?: string;
  publisher_phone?: string;
  publisher_email?: string;
};
export type VacancyCreateRead = {
  id: number;
  title: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  experience?: string;
  rating?: string;
  work_tags?: any;
  description?: string;
  responsibilities?: any;
  requirements?: any;
  offers?: any;
  key_skills?: any;
  work_place?: string;
  employment?: string;
  schedule?: string;
  working_hours?: string;
  work_format?: string;
  company_name: string;
  company_logo?: string | null;
  company_address?: string;
  company_website?: string;
  company_phone?: string;
  company_email?: string;
  company_description?: string;
  publisher_name?: string;
  publisher_position?: string;
  publisher_phone?: string;
  publisher_email?: string;
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
  useApiProjectsViewsCreateMutation,
  useApiProjectsCreateCreateMutation,
  useApiProjectsSpecialistListQuery,
  useApiResumesListQuery,
  useApiResumesRetrieveQuery,
  useApiResumesCreateCreateMutation,
  useApiSpecialistsListQuery,
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
