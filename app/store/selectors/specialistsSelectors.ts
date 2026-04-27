// store/selectors/specialistsSelectors.ts
import { RootState } from '../../store';
import { SpecialistCategory } from '@/types/specialists';

export const selectAllSpecialists = (state: RootState) => state.specialists.specialists;

export const selectSpecialistsByCategory = (state: RootState, category: SpecialistCategory) =>
  state.specialists.specialists.filter(s => s.category === category);

export const selectSpecialistBySlug = (state: RootState, category: SpecialistCategory, slug: string) =>
  state.specialists.specialists.find(s => s.category === category && s.slug === slug);

export const selectTopSpecialists = (state: RootState, limit: number = 4) =>
  [...state.specialists.specialists]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);