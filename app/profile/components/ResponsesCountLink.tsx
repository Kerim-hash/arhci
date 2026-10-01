import Link from "next/link";
import { MessageSquareText } from "lucide-react";

interface ResponsesCountLinkProps {
  href: string;
  /** Бэкенд отдаёт счётчик строкой; если его нет — показываем просто «Отклики». */
  count?: string | number;
}

export function ResponsesCountLink({ href, count }: ResponsesCountLinkProps) {
  const hasCount = count !== undefined && count !== null && count !== "";
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-[#333] hover:underline"
    >
      <MessageSquareText className="w-3.5 h-3.5" />
      {hasCount ? `Отклики (${count})` : "Отклики"}
    </Link>
  );
}
