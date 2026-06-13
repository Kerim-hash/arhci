// app/work/order/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useApiOrdersRetrieveQuery } from "@/services/generatedApi";
import { OrderDetailComponent } from "../../components/OrderDetail";

export default function OrderPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const { data: order, isLoading, error } = useApiOrdersRetrieveQuery(
    { id: orderId },
    { skip: isNaN(orderId) }
  );

  if (isLoading)
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Ошибка загрузки
      </div>
    );
  if (!order) return null;

  return <OrderDetailComponent order={order as any} />;
}
