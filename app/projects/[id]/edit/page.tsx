// app/projects/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { tokenStorage } from "@/hooks/storage";
import { useGetProfileQuery } from "@/app/store/features/authApi";
import { useApiProjectsRetrieveQuery } from "@/services/generatedApi";
import EditProjectForm from "../../components/EditProjectForm";

interface NoticeProps {
  title: string;
  text: string;
  actionHref: string;
  actionLabel: string;
}

function Notice({ title, text, actionHref, actionLabel }: NoticeProps) {
  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="text-center py-12 max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-2">{title}</h1>
        <p className="text-[#666666] mb-6">{text}</p>
        <Link href={actionHref}>
          <Button className="rounded-[40px]">{actionLabel}</Button>
        </Link>
      </div>
    </section>
  );
}

export default function EditProjectPage() {
  const params = useParams();
  const projectId = Number(params?.id);
  const isValidId = Number.isInteger(projectId) && projectId > 0;

  // Токен читаем после монтирования: на сервере localStorage нет,
  // и первая отрисовка не должна отличаться от серверной.
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(Boolean(tokenStorage.getAccessToken()));
  }, []);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileQuery(undefined, { skip: hasToken !== true });
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useApiProjectsRetrieveQuery({ id: projectId }, { skip: !isValidId });

  if (!isValidId || isProjectError) {
    return (
      <Notice
        title="Проект не найден"
        text="Возможно, ссылка устарела или у вас нет к нему доступа."
        actionHref="/projects"
        actionLabel="К списку проектов"
      />
    );
  }

  if (hasToken === false || isProfileError) {
    return (
      <Notice
        title="Нужно войти"
        text="Редактировать проект может только его автор."
        actionHref="/auth/login"
        actionLabel="Войти"
      />
    );
  }

  if (hasToken === null || isProfileLoading || isProjectLoading || !profile || !project) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="text-[#666666] mt-4">Загрузка проекта...</p>
        </div>
      </section>
    );
  }

  if (!profile.specialistId || profile.specialistId !== project.specialistId) {
    return (
      <Notice
        title="Нет доступа"
        text="Редактировать проект может только его автор."
        actionHref={`/projects/${projectId}`}
        actionLabel="К проекту"
      />
    );
  }

  return <EditProjectForm key={project.id} project={project} />;
}
