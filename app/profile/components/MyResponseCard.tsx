import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ModerationStatusBadge, ModerationStatus } from "@/components/ModerationStatusBadge";

interface MyResponseCardProps {
  /** Страница заказа или вакансии, на которые был оставлен отклик. */
  href: string;
  title: string;
  subtitle?: string;
  status?: ModerationStatus;
  message?: string;
  createdAt: string;
}

export function formatResponseDate(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Карточка собственного отклика: что откликнулся, когда и с каким сообщением. */
export function MyResponseCard({ href, title, subtitle, status, message, createdAt }: MyResponseCardProps) {
  return (
    <Card className="border border-[#F1EFEF]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <Link href={href} className="text-lg font-bold text-primary hover:underline">
            {title}
          </Link>
          {status && <ModerationStatusBadge status={status} />}
        </div>
        {subtitle && <p className="text-sm text-[#949494] mt-1">{subtitle}</p>}
        {message && (
          <p className="text-sm text-[#333] mt-3 whitespace-pre-line break-words">{message}</p>
        )}
        <p className="text-xs text-gray-500 mt-3">Отклик отправлен {formatResponseDate(createdAt)}</p>
      </CardContent>
    </Card>
  );
}
