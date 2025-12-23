import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <Separator className="mt-30 bg-[#333]" />
      <footer className="container mx-auto relative p-5 md:p-10 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <p className="text-[20px] mb-10">Logotype</p>
            <p className="text-[14px] text-[#6D6D6D] max-w-xl">
              Профессиональное сообщество для обмена идеями, поиска партнёров и
              освоения передовых технологий. Здесь вы найдёте инструменты,
              знания и сеть контактов для реализации проектов любой сложности.
              Ваш следующий шедевр начинается здесь.
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[16px] mb-10">About</p>
            <div className="flex flex-col gap-5">
              <Link href="/" className="text-[16px] text-[#6D6D6D]">
                Студентам
              </Link>
              <Link href="/architects" className="text-[16px] text-[#6D6D6D]">
                Архитекторы
              </Link>
              <Link href="/competitions" className="text-[16px] text-[#6D6D6D]">
                Конкурсы
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[16px] mb-10">Follow Us</p>
            <div className="flex flex-col gap-5">
              <Link href="/" className="text-[16px] text-[#6D6D6D] flex gap-2">
                <Image
                  src="/facebook.svg"
                  width={24}
                  height={24}
                  alt="facebook"
                />{" "}
                Facebook
              </Link>
              <Link href="/architects" className="text-[16px] text-[#6D6D6D] flex gap-2">
                <Image
                  src="/instagram.svg"
                  width={24}
                  height={24}
                  alt="facebook"
                />{" "}
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
