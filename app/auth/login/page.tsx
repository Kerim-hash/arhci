"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LoginSchema, TypeLoginSchema } from "@/schemas/login";
import { useLoginMutation } from "@/app/store/features/authApi";
import { useAuth } from "@/hooks/use-auth";

// Схема валидации формы

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
  const { loginSuccess } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TypeLoginSchema) => {
    try {
      const res = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      loginSuccess(res);
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : "Ошибка при входе в систему";
      toast.error(errorMessage);
      // if (
      // error?.data?.message?.includes(
      //   "crypto/bcrypt: hashedPassword is not the hash of the given password",
      // ) ||
      // error?.data?.error?.includes(
      //   "crypto/bcrypt: hashedPassword is not the hash of the given password",
      // ) ||
      // error?.message?.includes("Invalid credentials")
      // ) {

      //   toast.error("Incorrect password", { position: "bottom-left" });
      // } else {
      //   const message =
      //     typeof error === "string"
      //       ? error
      //       : error?.data?.message || error?.data?.error || "Error logging in";

      //   toast.error(message, { position: "bottom-left" });
      // }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" width={74} height={85} alt="Logotype" />
          <h1 className="mt-12.5 font-semibold text-[20px] text-center">
            Добро пожаловать в сообщество архитекторов
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-6 w-full"
          >
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Пароль"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>

            <Link
              href="/auth/register"
              className="text-[14px] text-center text-[#5b5b5b] block hover:text-primary transition-colors"
            >
              Нет аккаунта? Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
