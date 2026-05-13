import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto relative pt-5 bg-[#FBFBFB]">
      <Link href="/" className="absolute top-5 left-5">
        <Image src="/logo.png" width={78} height={26} alt="Logotype" />
      </Link>
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8">{children}</div>
      </div>
    </div>
  );
}
