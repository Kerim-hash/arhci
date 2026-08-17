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
import {
  RecoverSchema,
  TypeRecoverSchema,
  CheckCodeSchema,
  TypeCheckCodeSchema,
  NewPasswordSchema,
  TypeNewPasswordSchema,
} from "@/schemas/recover";
import {
  useRequestResetPasswordMutation,
  useCheckCodeMutation,
  useChangePasswordMutation,
} from "@/app/store/features/authApi";

type Step = "email" | "code" | "password";

function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as { data?: unknown; message?: string };
  if (err?.data) {
    if (typeof err.data === "string") return err.data;
    const data = err.data as Record<string, unknown>;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;
    const messages = Object.values(data).flat();
    if (messages.length > 0 && typeof messages[0] === "string") {
      return messages.join(", ");
    }
  }
  if (typeof err?.message === "string") return err.message;
  if (typeof error === "string") return error;
  return fallback;
}

export default function RecoverPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [requestReset, { isLoading: isSending }] =
    useRequestResetPasswordMutation();
  const [checkCode, { isLoading: isChecking }] = useCheckCodeMutation();
  const [changePassword, { isLoading: isSaving }] = useChangePasswordMutation();

  const emailForm = useForm<TypeRecoverSchema>({
    resolver: zodResolver(RecoverSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<TypeCheckCodeSchema>({
    resolver: zodResolver(CheckCodeSchema),
    defaultValues: { code: "" },
  });

  const passwordForm = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmitEmail = async (data: TypeRecoverSchema) => {
    try {
      await requestReset({ email: data.email }).unwrap();
      setEmail(data.email);
      setStep("code");
      toast.success("Код отправлен на email");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отправить код"));
    }
  };

  const onResendCode = async () => {
    try {
      await requestReset({ email }).unwrap();
      toast.success("Код отправлен повторно");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отправить код"));
    }
  };

  const onSubmitCode = async (data: TypeCheckCodeSchema) => {
    try {
      await checkCode({ email, code: data.code }).unwrap();
      setCode(data.code);
      setStep("password");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Неверный код"));
    }
  };

  const onSubmitPassword = async (data: TypeNewPasswordSchema) => {
    try {
      await changePassword({ email, code, password: data.password }).unwrap();
      toast.success("Пароль успешно изменён");
      router.push("/auth/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось изменить пароль"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" width={74} height={85} alt="Logotype" />

          {step === "email" && (
            <>
              <h1 className="mt-12.5 font-semibold text-[20px] text-center">
                Восстановление пароля
              </h1>
              <p className="mt-2 text-[14px] text-center text-[#5b5b5b]">
                Укажите email — мы отправим код подтверждения
              </p>

              <form
                onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                className="mt-8 space-y-6 w-full"
              >
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...emailForm.register("email")}
                    className={
                      emailForm.formState.errors.email ? "border-red-500" : ""
                    }
                    disabled={isSending}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md"
                  disabled={isSending}
                >
                  {isSending ? "Отправка..." : "Отправить код"}
                </Button>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <h1 className="mt-12.5 font-semibold text-[20px] text-center">
                Введите код
              </h1>
              <p className="mt-2 text-[14px] text-center text-[#5b5b5b]">
                Код отправлен на {email}
              </p>

              <form
                onSubmit={codeForm.handleSubmit(onSubmitCode)}
                className="mt-8 space-y-6 w-full"
              >
                <div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="Код из письма"
                    {...codeForm.register("code")}
                    className={
                      codeForm.formState.errors.code ? "border-red-500" : ""
                    }
                    disabled={isChecking}
                  />
                  {codeForm.formState.errors.code && (
                    <p className="mt-1 text-sm text-red-500">
                      {codeForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md"
                  disabled={isChecking}
                >
                  {isChecking ? "Проверка..." : "Подтвердить"}
                </Button>

                <button
                  type="button"
                  onClick={onResendCode}
                  disabled={isSending}
                  className="text-[14px] text-center text-[#5b5b5b] block w-full hover:text-primary transition-colors"
                >
                  {isSending ? "Отправка..." : "Отправить код повторно"}
                </button>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <h1 className="mt-12.5 font-semibold text-[20px] text-center">
                Новый пароль
              </h1>
              <p className="mt-2 text-[14px] text-center text-[#5b5b5b]">
                Придумайте новый пароль для {email}
              </p>

              <form
                onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                className="mt-8 space-y-6 w-full"
              >
                <div>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Новый пароль"
                    {...passwordForm.register("password")}
                    className={
                      passwordForm.formState.errors.password
                        ? "border-red-500"
                        : ""
                    }
                    disabled={isSaving}
                  />
                  {passwordForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Повторите пароль"
                    {...passwordForm.register("confirmPassword")}
                    className={
                      passwordForm.formState.errors.confirmPassword
                        ? "border-red-500"
                        : ""
                    }
                    disabled={isSaving}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md"
                  disabled={isSaving}
                >
                  {isSaving ? "Сохранение..." : "Сохранить пароль"}
                </Button>
              </form>
            </>
          )}

          <Link
            href="/auth/login"
            className="mt-6 text-[14px] text-center text-[#5b5b5b] block hover:text-primary transition-colors"
          >
            Вспомнили пароль? Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
