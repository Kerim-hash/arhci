// components/OrdersList.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setSearchQuery } from "@/app/store/features/ordersSlice";
import { OrderCard } from "./OrderCard";

export function OrdersList() {
  const dispatch = useAppDispatch();
  const { orders, searchQuery, filters } = useAppSelector(
    (state) => state.orders,
  );

  const filteredOrders = orders.filter((order) => {
    // Поиск по заголовку и описанию
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по типу недвижимости
    const matchesPropertyType =
      filters.propertyTypes.length === 0 ||
      filters.propertyTypes.some((type) => order.propertyType.includes(type));

    // Фильтр по бюджету
    const matchesBudget =
      (!filters.budgetFrom || order.budget >= Number(filters.budgetFrom)) &&
      (!filters.budgetTo || order.budget <= Number(filters.budgetTo));

    // Фильтр по программам
    const matchesSoftware =
      filters.software.length === 0 ||
      filters.software.some((sw) => order.software.includes(sw));

    return (
      matchesSearch && matchesPropertyType && matchesBudget && matchesSoftware
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          leftIcon={<Search className="text-gray-400 h-4 w-4" />}
          placeholder="Поиск вакансий..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="pl-10 rounded-[40px]"
        />
      </div>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
