"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  userType: "specialist" | "company" | "";
  specialization: string;
};

export default function LoginPage() {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      userType: "",
      specialization: "",
    },
  });

  const email = watch("email");
  const userType = watch("userType");
  const specialization = watch("specialization");

  const onNextStep = (data: Partial<FormValues>) => {
    if (step === 1 && data.email) {
      setStep(2);
    }
  };

  const onSpecializationStep = () => {
    if (userType === "specialist") {
      setStep(3);
    } else {
      onFinalSubmit({ email, userType, specialization: "" });
    }
  };

  const onFinalSubmit = (data: FormValues) => {
    if (userType === "company") {
      console.log("Form submitted (Company):", {
        email,
        userType: "company",
      });
      // Здесь отправка формы для компании
    } else if (userType === "specialist" && specialization) {
      console.log("Form submitted (Specialist):", {
        email,
        userType: "specialist",
        specialization,
      });
      // Здесь отправка формы для специалиста
    }
  };

  const handleBack = () => {
    if (step === 2 && userType === "specialist") {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const specializations = [
    { id: "architect", label: "Архитектор" },
    { id: "engineer", label: "Инженер" },
    { id: "visualizer", label: "Визуализатор" },
    { id: "interior_designer", label: "Дизайнер интерьера" },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
      <Image src="/logo.png" width={74} height={85} alt="Logotype" />

      <h1 className="mt-8 mx-auto font-semibold text-[20px] text-center whitespace-nowrap">
        Добро пожаловать в сообщество архитекторов
      </h1>

      {step === 1 ? (
        // Шаг 1: Email
        <form
          onSubmit={handleSubmit(onNextStep)}
          className="mt-8 space-y-6 w-full"
        >
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email обязателен",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Неверный формат email",
                },
              })}
              className="w-full"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={!email}>
            Продолжить
          </Button>

          <Link
            href="/auth/login"
            className="text-[14px] text-center text-[#5b5b5b] block hover:text-[#333] transition-colors"
          >
            вернуться назад
          </Link>
        </form>
      ) : step === 2 ? (
        // Шаг 2: Выбор типа пользователя
        <form
          onSubmit={handleSubmit(onSpecializationStep)}
          className="mt-8 space-y-8 w-full"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center">
              Выберите тип аккаунта
            </h2>

            <div className="flex gap-6">
              {/* Карточка для специалиста */}
              <button
                type="button"
                onClick={() =>
                  setValue("userType", "specialist", { shouldValidate: true })
                }
                className={`w-full cursor-pointer text-left flex flex-col justify-center items-center gap-4 border rounded-[40px] p-5 transition-all ${
                  userType === "specialist"
                    ? "border-blue-500 bg-blue-50"
                    : "border-[#333333] hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <Image src="/user.svg" width={28} height={36} alt="user" />
                <div className="flex-1">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-semibold text-lg text-center">
                      Я специалист
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                    Выбирайте этот пункт, если вы архитектор, инженер, дизайнер
                  </p>
                </div>
              </button>

              {/* Карточка для компании */}
              <button
                type="button"
                onClick={() =>
                  setValue("userType", "company", { shouldValidate: true })
                }
                className={`w-full cursor-pointer text-left flex flex-col justify-center items-center gap-4 border rounded-[40px] p-5 transition-all ${
                  userType === "company"
                    ? "border-blue-500 bg-blue-50"
                    : "border-[#333333] hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <Image
                  src="/company.svg"
                  width={40}
                  height={36}
                  alt="building"
                />
                <div className="flex-1">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-semibold text-lg">Компания</span>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                    Выбирайте этот пункт, если вы представляете компанию
                  </p>
                </div>
              </button>
            </div>

            {errors.userType && (
              <p className="text-sm text-red-500 text-center">
                {errors.userType.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!userType}
            >
              Продолжить
            </Button>

            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleBack}
              className="w-full flex items-center justify-center rounded-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
          </div>
        </form>
      ) : (
        // Шаг 3: Выбор специализации (только для специалистов)
        <form
          onSubmit={handleSubmit(onFinalSubmit)}
          className="mt-8 space-y-8 w-full"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center">
              Выберите вашу специализацию
            </h2>

            <div className="space-y-3">
              {specializations.map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() =>
                    setValue("specialization", spec.id, {
                      shouldValidate: true,
                    })
                  }
                  className={`w-full cursor-pointer flex items-center gap-4 border rounded-[40px] p-4 transition-all ${
                    specialization === spec.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-[#333333] hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs">Icon</span>
                    </div>
                  </div>
                  <span className="font-medium text-lg flex-1 text-left">
                    {spec.label}
                  </span>
                  {specialization === spec.id && (
                    <Check className="w-5 h-5 text-blue-500 mr-2" />
                  )}
                </button>
              ))}
            </div>

            {errors.specialization && (
              <p className="text-sm text-red-500 text-center">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!specialization}
            >
              Зарегистрироваться
            </Button>

            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleBack}
              className="w-full flex items-center justify-center rounded-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
