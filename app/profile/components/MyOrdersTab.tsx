"use client";

import { toast } from "sonner";
import {
  useApiOrdersDestroyMutation,
  useApiOrdersListQuery,
} from "@/services/generatedApi";
import { useGetProfileQuery } from "@/app/store/features/authApi";
import { formatApiError } from "@/lib/formatApiError";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { MyContentRow } from "./MyContentRow";
import { MyOrderResponsesList } from "./MyOrderResponsesList";
import { ResponsesCountLink } from "./ResponsesCountLink";

/**
 * «Мои заказы»: компания видит размещённые заказы, специалист — свои отклики
 * на заказы (сам он заказы не размещает).
 */
export function MyOrdersTab() {
  const { data: user } = useGetProfileQuery();

  if (user?.role === "specialist") {
    return <MyOrderResponsesList />;
  }

  return <MyOrdersList />;
}

function MyOrdersList() {
  const { data, isLoading, isError, refetch } = useApiOrdersListQuery({ mine: true });
  const [destroyOrder] = useApiOrdersDestroyMutation();
  const orders = data?.results || [];

  const handleDelete = async (id: number) => {
    try {
      await destroyOrder({ id }).unwrap();
      toast.success("Заказ удалён");
      refetch();
    } catch (err) {
      toast.error(formatApiError(err, "Не удалось удалить заказ"));
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не удалось загрузить заказы.</p>
        <Button variant="outline" className="mt-4 rounded-[40px]" onClick={() => refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="У вас пока нет заказов"
        description="Заказы, которые вы разместили, появятся здесь."
      />
    );
  }

  return (
    <div>
      {orders.map((order) => (
        <MyContentRow
          key={order.id}
          title={order.title}
          createdAt={order.createdAt}
          status={order.moderationStatus}
          moderationComment={order.moderationComment}
          href={`/work/order/${order.id}`}
          extra={
            <ResponsesCountLink
              href={`/profile/orders/${order.id}/responses`}
              count={order.responsesCount}
            />
          }
          onDelete={() => handleDelete(order.id)}
        />
      ))}
    </div>
  );
}
