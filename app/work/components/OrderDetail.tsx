// app/work/components/OrderDetail.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
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
  type OrderDetailRead,
} from "@/services/generatedApi";
import { OrderCard } from "./OrderCard";
import { RespondButton } from "./RespondButton";
import Image from "next/image";
import RichContent from "@/components/content/RichContent";
import { asStringArray } from "../model/format";

const SIMILAR_ORDERS_LIMIT = 3;

interface OrderDetailProps {
  order: OrderDetailRead;
}

export function OrderDetailComponent({ order }: OrderDetailProps) {
  const [respondToOrder] = useApiOrdersRespondCreateMutation();

  // Получаем список похожих заказов (в данном случае просто берем список)
  const { data: similarOrdersData } = useApiOrdersListQuery({ ordering: "-created_at" });

  // Исключаем текущий заказ из списка похожих
  const similarOrders =
    similarOrdersData?.results
      ?.filter((item) => item.id !== order.id)
      .slice(0, SIMILAR_ORDERS_LIMIT) ?? [];

  const tags = [...asStringArray(order.propertyType), ...asStringArray(order.software)];
  const customerName = order.createdByName || "Имя не указано";

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
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <RespondButton
                className="w-fit px-8"
                onRespond={() => respondToOrder({ id: order.id }).unwrap()}
              />

              <div className="pt-4 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Описание проекта</h2>
                  <RichContent
                    className="ck-content text-gray-700 leading-relaxed text-[15px]"
                    html={order.description || ""}
                  />
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
                {similarOrders.map((similarOrder) => (
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
                    alt={customerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{customerName}</h3>
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
