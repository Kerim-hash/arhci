// components/OrderCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/app/store/features/ordersSlice";
import { useAppDispatch } from "@/app/store/hooks";
import { useState } from "react";
import { respondToOrder } from "@/app/store/features/orderDetailSlice";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const dispatch = useAppDispatch();
  const [isResponding, setIsResponding] = useState(false);

  const handleRespond = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResponding(true);
    await dispatch(respondToOrder(order.id.toString()));
    setIsResponding(false);
  };

  return (
    <Card className="border border-[#F1EFEF] hover:shadow-md transition-shadow">
      <CardContent className="p-0!">
        <div className="flex flex-col gap-4">
          {/* <div className="flex-1"> */}
          <h3 className="text-[20px] font-bold text-primary">{order.title}</h3>

          <div className="flex items-center gap-3 ">
            <div className="flex items-center gap-1 font-semibold">
              <span>{order.budget.toLocaleString()} сом</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm  line-clamp-2">
            {order.description}
          </p>

          {/* Теги */}
          <div className="flex flex-wrap gap-2">
            {order.propertyType.map((type) => (
              <span
                key={type}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
            {order.software.map((sw) => (
              <span
                key={sw}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {sw}
              </span>
            ))}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              className="rounded-[40px] mt-6 whitespace-nowrap"
              onClick={handleRespond}
              disabled={isResponding}
            >
              {isResponding ? "Отправка..." : "Откликнуться"}
            </Button>
          </div>
          {/* </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
