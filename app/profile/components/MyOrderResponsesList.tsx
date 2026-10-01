"use client";

import { useApiOrdersMyResponsesListQuery } from "@/services/generatedApi";
import type { ModerationStatus } from "@/components/ModerationStatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { MyResponseCard } from "./MyResponseCard";

// В openapi.yaml вложенный заказ описан как свободный объект — фиксируем
// поля, которые реально отдаёт бэкенд.
interface ResponseOrder {
  id: number;
  title: string;
  budget?: number;
  moderationStatus?: ModerationStatus;
}

/** Отклики текущего пользователя на заказы. */
export function MyOrderResponsesList() {
  const { data, isLoading, isError, refetch } = useApiOrdersMyResponsesListQuery({});
  const responses = data?.results || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не удалось загрузить отклики.</p>
        <Button variant="outline" className="mt-4 rounded-[40px]" onClick={() => refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <EmptyState
        title="Вы пока не откликались на заказы"
        description="Найдите подходящий заказ и оставьте отклик — он появится здесь."
        actionLabel="Смотреть заказы"
        actionHref="/work"
      />
    );
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => {
        const order = response.order as ResponseOrder;
        return (
          <MyResponseCard
            key={response.id}
            href={`/work/order/${order.id}`}
            title={order.title}
            subtitle={order.budget ? `${order.budget.toLocaleString()} сом` : "Бюджет не указан"}
            status={order.moderationStatus}
            message={response.message}
            createdAt={response.createdAt}
          />
        );
      })}
    </div>
  );
}
