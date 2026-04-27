"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectUser } from "../auth/model/authSlice";

const Header: FC = () => {
  const user = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Главная", link: "" },
    { label: "Статьи", link: "articles" },
    { label: "Специалисты", link: "specialists" },
    { label: "Проекты", link: "projects" },
    { label: "Работа", link: "work" },
    { label: "Новости", link: "news" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const handleScrollToSection = (
  //   e: React.MouseEvent<HTMLAnchorElement>,
  //   link: string
  // ) => {
  //   e.preventDefault();

  //   if (pathname !== "/") {
  //     router.push(`/${link}`);
  //     setIsMenuOpen(false);
  //     return;
  //   }

  //   const section = document.getElementById(link);
  //   if (section) {
  //     section.scrollIntoView({ behavior: "smooth" });
  //     setIsMenuOpen(false);
  //   }
  // };

  return (
    <header
      className={clsx(
        "py-4 fixed top-0 left-0 w-full z-50 transition-colors duration-300",
        isScrolled ? "bg-white shadow-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto container grid grid-cols-12 items-center py-4 px-5">
        {/* LOGO – 15% */}
        <div className="col-span-6 lg:col-span-2 flex items-center h-[26px]">
          <Link href="/">
            <Image
              src="/logo.png"
              width={78}
              height={26}
              alt="Logotype"
              className="h-[26px]"
              priority
            />
          </Link>
        </div>

        {/* NAV – 70% */}
        <div className="hidden lg:flex col-span-8 justify-center">
          <nav className="flex items-center gap-8 text-secondary-foreground">
            {navLinks.map(({ label, link }) => (
              <a
                key={link}
                href={`/${link}`}
                className="hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* SEARCH – 15% (desktop only) */}
        <div className="f hidden lg:flex items-center col-span-2 justify-end">
          <Button
            variant="ghost"
            className="w-6 h-6"
            size="icon"
            aria-label="Search"
            asChild
          >
            <Image
              src="/search.svg"
              alt="article"
              width={24}
              height={24}
              className="rounded-full object-scale-down"
            />
          </Button>
          <Link
            href={"/create-acticle"}
            className="w-6 h-6 rounded-full overflow-hidden ml-4"
          >
            <Image
              src="/pencil.svg"
              alt="article"
              width={24}
              height={24}
              className="rounded-full"
            />
          </Link>
          <Link
            href={"/profile"}
            className="w-12 h-12 flex justify-center items-center rounded-full overflow-hidden ml-4"
          >
            <Image
              src={user?.image || "/user.svg"}
              alt="article"
              width={48}
              height={48}
              className="rounded-full object-none "
            />
          </Link>
        </div>

        {/* BURGER – mobile only */}
        <div className="lg:hidden col-span-6 flex justify-end">
          <button
            className="p-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-foreground" />
              <span className="block w-6 h-0.5 bg-foreground" />
              <span className="block w-6 h-0.5 bg-foreground" />
            </div>
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={clsx(
          "fixed top-0 right-0 h-screen w-3/4 max-w-xs bg-white shadow-lg z-50 transition-transform",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-6">
          <button
            className="self-end text-[#333] text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>

          <nav className="flex flex-col gap-4 mt-6">
            {navLinks.map(({ label, link }) => (
              <Link key={link} href={`/${link}`} className="text-[#333]">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
