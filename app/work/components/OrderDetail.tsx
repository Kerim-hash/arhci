// app/work/components/OrderDetail.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  useApiOrdersRespondCreateMutation,
  useApiOrdersListQuery,
} from "@/services/generatedApi";
import { useState } from "react";
import { toast } from "sonner";
import { OrderCard } from "./OrderCard";
import Image from "next/image";

interface OrderDetailProps {
  order: any;
}

export function OrderDetailComponent({ order }: OrderDetailProps) {
  const [respondToOrder] = useApiOrdersRespondCreateMutation();
  const [isResponding, setIsResponding] = useState(false);

  // Получаем список похожих заказов (в данном случае просто берем список)
  const { data: similarOrdersData } = useApiOrdersListQuery({ ordering: "-created_at" });
  
  // Исключаем текущий заказ из списка похожих
  const similarOrders = similarOrdersData?.results?.filter(
    (item: any) => item.id !== order.id
  ).slice(0, 3) || [];

  const handleRespond = async () => {
    setIsResponding(true);
    try {
      await respondToOrder({ id: order.id }).unwrap();
      toast.success("Отклик отправлен");
    } catch (error: any) {
      if (error?.status === 401) {
        toast.error("Авторизуйтесь, чтобы откликнуться");
      } else {
        toast.error("Ошибка при отправке отклика");
      }
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="p-0!">
          <BreadcrumbItem>
            <BreadcrumbLink href="/work">Работа</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/work?tab=orders">Заказы</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - основная информация */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0! space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-3">{order.title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1 font-semibold text-lg">
                    <span>
                      {order.budget ? `${order.budget.toLocaleString()} сом` : "Бюджет не указан"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-fit rounded-[40px] px-8"
                onClick={handleRespond}
                disabled={isResponding}
              >
                {isResponding ? "Отправка..." : "Откликнуться"}
              </Button>

              <div className="pt-4 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Описание проекта</h2>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-[15px]">
                    {order.description}
                  </div>
                </div>
                
                {/* Если в будущем добавятся поля для файлов или локации, их можно вывести здесь */}
              </div>
            </CardContent>
          </Card>

          {/* Блок Похожие заказы */}
          {similarOrders.length > 0 && (
            <div className="pt-8">
              <h2 className="text-xl font-bold mb-6">Похожие заказы</h2>
              <div className="space-y-4">
                {similarOrders.map((similarOrder: any) => (
                  <OrderCard key={similarOrder.id} order={similarOrder} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Правая колонка - сайдбар */}
        <div className="lg:col-span-1">
          <Card className="sticky top-[100px] border border-[#F1EFEF]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src="/user.svg"
                    alt={order.created_by_name || "Пользователь"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {order.created_by_name || "Имя не указано"}
                  </h3>
                  <p className="text-gray-500 text-sm">Заказчик</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
