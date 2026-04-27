import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto relative pt-5 bg-[#FBFBFB]">
      <Image src="/logo-auth.png" width={144} height={48} alt="Logotype" />
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8">{children}</div>
      </div>
    </div>
  );
}