"use client";

import { MyOrderResponsesList } from "./MyOrderResponsesList";
import { MyVacancyResponsesList } from "./MyVacancyResponsesList";

/** «Мои отклики»: отклики пользователя на вакансии и на заказы. */
export function MyResponsesTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold mb-4">Отклики на вакансии</h2>
        <MyVacancyResponsesList />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Отклики на заказы</h2>
        <MyOrderResponsesList />
      </section>
    </div>
  );
}
