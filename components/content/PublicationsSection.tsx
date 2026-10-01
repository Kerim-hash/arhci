import { LoadMoreButton } from "@/app/work/components/LoadMoreButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PublicationGrid, type Publication } from "./PublicationGrid";

interface PublicationsSectionProps {
  title: string;
  /** Раздел сайта: `/articles` или `/news`. */
  basePath: string;
  emptyText: string;
  errorText: string;
  showViews?: boolean;
  items: Publication[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

/** Страница-список статей или новостей: заголовок, сетка, «Показать ещё». */
export function PublicationsSection({
  title,
  basePath,
  emptyText,
  errorText,
  showViews,
  items,
  isLoading,
  isError,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onRetry,
}: PublicationsSectionProps) {
  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center py-12">
          <p className="text-xl text-red-600">{errorText}</p>
          <Button className="mt-4 rounded-[40px]" onClick={onRetry}>
            Попробовать снова
          </Button>
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{emptyText}</p>
        </div>
      );
    }
    return (
      <>
        <PublicationGrid items={items} basePath={basePath} showViews={showViews} />
        <div className="mt-8">
          <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={onLoadMore} />
        </div>
      </>
    );
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">{title}</h1>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />
        </div>
      </div>

      {renderBody()}
    </section>
  );
}
