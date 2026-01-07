import Image from "next/image";
import ClientEditor from "./ClientEditor";

export default function Page() {
  return (
    <section className="container mx-auto relative px-4 sm:px-6">
      <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
        Написать как:
        <Image
          src="/article.jpg"
          width={24}
          height={24}
          alt="article"
          className="rounded-full"
        />
        Daniar Asanov
      </div>

      <ClientEditor />
    </section>
  );
}
