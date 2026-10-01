"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { formatApiError } from "@/lib/formatApiError";
import type { ResponseAuthorRead } from "@/services/generatedApi";
import { formatResponseDate } from "./MyResponseCard";

/** Общая форма отклика на заказ и на вакансию (owner-only списки). */
export interface ResponseItem {
  id: number;
  message?: string;
  createdAt: string;
  user: ResponseAuthorRead;
}

interface ResponsesPageProps {
  heading: string;
  /** Название заказа или вакансии, если уже загружено. */
  itemTitle?: string;
  responses: ResponseItem[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
}

function isUnauthorized(error: unknown): boolean {
  return !!error && typeof error === "object" && "status" in error && error.status === 401;
}

export function ResponsesPage({
  heading,
  itemTitle,
  responses,
  isLoading,
  isError,
  error,
  onRetry,
}: ResponsesPageProps) {
  const router = useRouter();
  const unauthorized = isError && isUnauthorized(error);

  useEffect(() => {
    if (unauthorized) {
      router.push("/auth/login");
    }
  }, [unauthorized, router]);

  const renderBody = () => {
    if (isLoading || unauthorized) {
      return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
    }

    if (isError) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>{formatApiError(error, "Не удалось загрузить отклики.")}</p>
          <Button variant="outline" className="mt-4 rounded-[40px]" onClick={onRetry}>
            Повторить
          </Button>
        </div>
      );
    }

    if (responses.length === 0) {
      return (
        <EmptyState
          title="Откликов пока нет"
          description="Как только кто-то откликнется, вы увидите контакты и сообщение здесь."
        />
      );
    }

    return (
      <div className="space-y-4">
        {responses.map((response) => (
          <ResponseCard key={response.id} response={response} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад в кабинет
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        {itemTitle && <p className="text-gray-500 mt-1">{itemTitle}</p>}
      </div>

      {renderBody()}
    </div>
  );
}

function ResponseCard({ response }: { response: ResponseItem }) {
  const { user } = response;
  const name = user.name?.trim() || user.email;

  return (
    <Card className="border border-[#F1EFEF]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {user.specialistSlug ? (
            <Link
              href={`/specialists/architects/${user.specialistSlug}`}
              className="text-lg font-bold text-primary hover:underline"
            >
              {name}
            </Link>
          ) : (
            <span className="text-lg font-bold text-primary">{name}</span>
          )}
          <span className="text-xs text-gray-500">{formatResponseDate(response.createdAt)}</span>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-[#949494]">
          {user.email && (
            <a href={`mailto:${user.email}`} className="inline-flex items-center gap-1.5 hover:text-primary">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </a>
          )}
          {user.phone && (
            <a href={`tel:${user.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary">
              <Phone className="w-3.5 h-3.5" />
              {user.phone}
            </a>
          )}
        </div>

        {response.message && (
          <p className="text-sm text-[#333] mt-3 whitespace-pre-line break-words">{response.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
