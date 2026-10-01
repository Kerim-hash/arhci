"use client";

import { useParams } from "next/navigation";
import {
  useApiOrdersResponsesListQuery,
  useApiOrdersRetrieveQuery,
} from "@/services/generatedApi";
import { ResponsesPage } from "@/app/profile/components/ResponsesPage";

/** Отклики на заказ — доступны только его автору. */
export default function OrderResponsesPage() {
  const params = useParams();
  const orderId = Number(params.id);
  const skip = !Number.isFinite(orderId);

  const { data: order } = useApiOrdersRetrieveQuery({ id: orderId }, { skip });
  const { data, isLoading, isError, error, refetch } = useApiOrdersResponsesListQuery(
    { id: orderId },
    { skip },
  );

  return (
    <ResponsesPage
      heading="Отклики на заказ"
      itemTitle={order?.title}
      responses={data?.results || []}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
    />
  );
}
