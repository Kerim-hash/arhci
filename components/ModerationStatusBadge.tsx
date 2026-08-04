import { Badge } from "@/components/ui/badge";

export type ModerationStatus = "approved" | "pending" | "rejected";

const STATUS_LABELS: Record<ModerationStatus, string> = {
  approved: "Опубликовано",
  pending: "На модерации",
  rejected: "Отклонено",
};

const STATUS_CLASSES: Record<ModerationStatus, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export function ModerationStatusBadge({ status }: { status: ModerationStatus }) {
  return (
    <Badge className={STATUS_CLASSES[status]}>{STATUS_LABELS[status]}</Badge>
  );
}
