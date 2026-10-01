"use client";

import { toast } from "sonner";
import {
  useApiCompetitionsDestroyMutation,
  useApiCompetitionsListQuery,
} from "@/services/generatedApi";
import { formatApiError } from "@/lib/formatApiError";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { MyContentRow } from "./MyContentRow";

/** «Конкурсы»: конкурсы, которые организовал текущий пользователь. */
export function MyContestsTab() {
  const { data, isLoading, isError, refetch } = useApiCompetitionsListQuery({ mine: true });
  const [destroyCompetition] = useApiCompetitionsDestroyMutation();
  const competitions = data?.results || [];

  const handleDelete = async (id: number) => {
    try {
      await destroyCompetition({ id }).unwrap();
      toast.success("Конкурс удалён");
      refetch();
    } catch (err) {
      toast.error(formatApiError(err, "Не удалось удалить конкурс"));
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не удалось загрузить конкурсы.</p>
        <Button variant="outline" className="mt-4 rounded-[40px]" onClick={() => refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <EmptyState
        title="У вас пока нет конкурсов"
        description="Конкурсы, которые вы организовали, появятся здесь."
        actionLabel="Создать конкурс"
        actionHref="/competitions/create"
      />
    );
  }

  return (
    <div>
      {competitions.map((competition) => (
        <MyContentRow
          key={competition.id}
          title={competition.title}
          createdAt={competition.createdAt}
          status={competition.moderationStatus}
          moderationComment={competition.moderationComment}
          href={`/competitions/${competition.slug}`}
          extra={
            <span className="text-sm text-gray-500">
              Участников: {competition.participantsCount ?? 0}
            </span>
          }
          onDelete={() => handleDelete(competition.id)}
        />
      ))}
    </div>
  );
}
