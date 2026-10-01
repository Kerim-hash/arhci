// components/OrderCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  useApiOrdersRespondCreateMutation,
  type OrderListRead,
} from "@/services/generatedApi";
import { asStringArray } from "../model/format";
import { RespondButton } from "./RespondButton";

interface OrderCardProps {
  order: OrderListRead;
}

export function OrderCard({ order }: OrderCardProps) {
  const [respondToOrder] = useApiOrdersRespondCreateMutation();
  const tags = [...asStringArray(order.propertyType), ...asStringArray(order.software)];

  return (
    <Card className="border border-[#F1EFEF] hover:shadow-md transition-shadow">
      <CardContent className="p-5! flex flex-col gap-4">
        <Link href={`/work/order/${order.id}`} className="block">
          <h3 className="text-[20px] font-bold text-primary">{order.title}</h3>
        </Link>

        <div className="flex items-center gap-3 ">
          <div className="flex items-center gap-1 font-semibold">
            <span>
              {order.budget ? `${order.budget.toLocaleString()} сом` : "Бюджет не указан"}
            </span>
          </div>
          {order.createdByName && (
            <span className="text-sm text-[#949494]">{order.createdByName}</span>
          )}
        </div>

        {/* Теги */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <RespondButton
          className="mt-2 w-fit"
          onRespond={() => respondToOrder({ id: order.id }).unwrap()}
        />
      </CardContent>
    </Card>
  );
}
