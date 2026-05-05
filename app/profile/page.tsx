"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { EditProfileSchema, TypeEditProfileSchema } from "@/schemas/editProfile";
import { useGetProfileQuery } from "@/app/store/features/authApi";
import {
  useEditProfileMutation,
  useChangePasswordMutation,
  useCheckPasswordMutation
} from "@/app/store/features/editProfileApi";
import { User } from "@/types/user";

type TabType = "personal" | "social" | "password";

const Profile = () => {
  const { data: user, isLoading } = useGetProfileQuery();
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  const tabs = [
    { id: "personal" as const, label: "Личная информация" },
    { id: "social" as const, label: "Социальные сети" },
    { id: "password" as const, label: "Пароль" },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo user={user} />;
      case "social":
        return <SocialLinks user={user} />;
      case "password":
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Левая панель - 40% */}
        <div className="md:w-[40%] lg:w-[35%]">
          <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24">
            {/* Аватар и имя пользователя */}
            <div className="text-center mb-6 pb-6 border-b border-gray-200">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={user?.image || "/user.svg"}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                  </svg>
                </button>
              </div>
              <h3 className="font-semibold text-lg">{user?.name || (user?.first_name || user?.firstName ? `${user?.first_name || user?.firstName || ""} ${user?.last_name || user?.lastName || ""}`.trim() : "Пользователь")}</h3>
              <p className="text-gray-500 text-sm">
                {user?.position || (user?.role === "specialist" ? "Специалист" : "Компания")}
              </p>
            </div>

            {/* Навигация */}
            <nav className="space-y-2">
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full border-b cursor-pointer flex items-center gap-3 py-3 transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-gray-700 hover:text-primary"
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Правая панель - 60% */}
        <div className="md:w-[60%] lg:w-[65%]">
          <div className="p-6 md:p-8 bg-white rounded-lg border border-gray-100">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

// Компонент личной информации
const PersonalInfo = ({ user }: { user?: User }) => {
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TypeEditProfileSchema>({
    resolver: zodResolver(EditProfileSchema) as any,
    defaultValues: {
      email: user?.email || "",
      name: user?.name || (user?.first_name || user?.firstName ? `${user?.first_name || user?.firstName || ""} ${user?.last_name || user?.lastName || ""}`.trim() : ""),
      phone: user?.phone || "",
      position: user?.position || "",
      company_name: user?.company_name || user?.companyName || user?.firm || "",
      bio: user?.bio || "",
      specialization: user?.specialization || "",
      experience_years: user?.experience_years || user?.experienceYears || undefined,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        name: user.name || (user.first_name || user.firstName ? `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim() : ""),
        phone: user.phone || "",
        position: user.position || "",
        company_name: user.company_name || user.companyName || user.firm || "",
        bio: user.bio || "",
        specialization: user.specialization || "",
        experience_years: user.experience_years || user.experienceYears || undefined,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: TypeEditProfileSchema) => {
    try {
      const payload = { ...data };
      if (payload.name) {
        const parts = payload.name.trim().split(" ");
        payload.first_name = parts[0];
        if (parts.length > 1) {
          payload.last_name = parts.slice(1).join(" ");
        }
      }
      await editProfile(payload).unwrap();
      toast.success("Профиль успешно обновлен");
    } catch (error: any) {
      if (error?.data && typeof error.data === 'object') {
        let hasErrors = false;
        Object.keys(error.data).forEach((key) => {
          const message = Array.isArray(error.data[key]) ? error.data[key][0] : error.data[key];
          if (key === 'detail' || key === 'non_field_errors') {
            toast.error(message);
            hasErrors = true;
          } else {
            setError(key as any, { type: "server", message });
            hasErrors = true;
          }
        });
        if (!hasErrors) toast.error("Ошибка при обновлении профиля");
      } else {
        toast.error("Ошибка при обновлении профиля");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Личная информация</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">Полное имя</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Иванов Александр Петрович"
            className="mt-1.5"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="alex@example.com"
            className="mt-1.5"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+7 (999) 123-45-67"
            className="mt-1.5"
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="position">Должность</Label>
          <Input
            id="position"
            {...register("position")}
            placeholder="Ведущий архитектор"
            className="mt-1.5"
          />
          {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position.message}</p>}
        </div>

        {user?.role === "company" && (
          <div>
            <Label htmlFor="company_name">Компания / Бюро</Label>
            <Input
              id="company_name"
              {...register("company_name")}
              placeholder="Название компании"
              className="mt-1.5"
            />
            {errors.company_name && <p className="text-sm text-red-500 mt-1">{errors.company_name.message}</p>}
          </div>
        )}

        <div>
          <Label htmlFor="bio">О себе</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            placeholder="Расскажите о своем опыте, проектах и интересах..."
            rows={4}
            className="mt-1.5"
          />
          {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <Label htmlFor="specialization">Специализация</Label>
          <Input
            id="specialization"
            {...register("specialization")}
            placeholder="Жилые комплексы, общественные здания"
            className="mt-1.5"
          />
          {errors.specialization && <p className="text-sm text-red-500 mt-1">{errors.specialization.message}</p>}
        </div>

        <div>
          <Label htmlFor="experience_years">Опыт работы (лет)</Label>
          <Input
            id="experience_years"
            type="number"
            {...register("experience_years", { valueAsNumber: true })}
            placeholder="5"
            className="mt-1.5"
          />
          {errors.experience_years && <p className="text-sm text-red-500 mt-1">{errors.experience_years.message}</p>}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </form>
    </div>
  );
};

// Компонент социальных сетей
const SocialLinks = ({ user }: { user?: User }) => {
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TypeEditProfileSchema>({
    resolver: zodResolver(EditProfileSchema) as any,
    defaultValues: {
      instagram: user?.instagram || "",
      telegram: user?.telegram || "",
      linkedin: user?.linkedin || "",
      behance: user?.behance || "",
      website: user?.website || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        instagram: user.instagram || "",
        telegram: user.telegram || "",
        linkedin: user.linkedin || "",
        behance: user.behance || "",
        website: user.website || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: TypeEditProfileSchema) => {
    try {
      await editProfile(data).unwrap();
      toast.success("Социальные сети успешно обновлены");
    } catch (error: any) {
      if (error?.data && typeof error.data === 'object') {
        let hasErrors = false;
        Object.keys(error.data).forEach((key) => {
          const message = Array.isArray(error.data[key]) ? error.data[key][0] : error.data[key];
          if (key === 'detail' || key === 'non_field_errors') {
            toast.error(message);
            hasErrors = true;
          } else {
            setError(key as any, { type: "server", message });
            hasErrors = true;
          }
        });
        if (!hasErrors) toast.error("Ошибка при обновлении социальных сетей");
      } else {
        toast.error("Ошибка при обновлении социальных сетей");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Социальные сети</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <div className="relative mt-1.5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              @
            </span>
            <Input id="instagram" {...register("instagram")} placeholder="username" className="pl-8" />
          </div>
          {errors.instagram && <p className="text-sm text-red-500 mt-1">{errors.instagram.message}</p>}
        </div>

        <div>
          <Label htmlFor="telegram">Telegram</Label>
          <div className="relative mt-1.5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              @
            </span>
            <Input id="telegram" {...register("telegram")} placeholder="username" className="pl-8" />
          </div>
          {errors.telegram && <p className="text-sm text-red-500 mt-1">{errors.telegram.message}</p>}
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            {...register("linkedin")}
            placeholder="https://linkedin.com/in/username"
            className="mt-1.5"
          />
          {errors.linkedin && <p className="text-sm text-red-500 mt-1">{errors.linkedin.message}</p>}
        </div>

        <div>
          <Label htmlFor="behance">Behance</Label>
          <Input
            id="behance"
            {...register("behance")}
            placeholder="https://behance.net/username"
            className="mt-1.5"
          />
          {errors.behance && <p className="text-sm text-red-500 mt-1">{errors.behance.message}</p>}
        </div>

        <div>
          <Label htmlFor="website">Личный сайт / Портфолио</Label>
          <Input
            id="website"
            {...register("website")}
            placeholder="https://example.com"
            className="mt-1.5"
          />
          {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </form>
    </div>
  );
};

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Введите текущий пароль"),
  newPassword: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  confirmPassword: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});

type TypeChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;

// Компонент смены пароля
const ChangePassword = () => {
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();
  const [checkPassword, { isLoading: isChecking }] = useCheckPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TypeChangePasswordSchema>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: TypeChangePasswordSchema) => {
    // 1. Проверяем текущий пароль
    try {
      await checkPassword({ password: data.currentPassword }).unwrap();
    } catch (checkErr: any) {
      if (checkErr?.status === 400 || checkErr?.status === 401) {
         setError("currentPassword", { type: "server", message: "Неверный текущий пароль" });
      } else {
         toast.error("Ошибка при проверке пароля");
      }
      console.error(checkErr);
      return; // Прерываем выполнение
    }

    // 2. Если проверка успешна, меняем на новый пароль
    try {
      await changePassword({ password: data.newPassword }).unwrap();
      toast.success("Пароль успешно изменен");
      reset();
    } catch (changeErr: any) {
      if (changeErr?.data && typeof changeErr.data === 'object') {
        let hasErrors = false;
        Object.keys(changeErr.data).forEach((key) => {
          const message = Array.isArray(changeErr.data[key]) ? changeErr.data[key][0] : changeErr.data[key];
          if (key === 'detail' || key === 'non_field_errors') {
            toast.error(message);
            hasErrors = true;
          } else if (key === 'password' || key === 'new_password') {
            // Ошибка от changePassword относится к новому паролю
            setError("newPassword", { type: "server", message });
            hasErrors = true;
          } else {
            try {
              setError(key as any, { type: "server", message });
            } catch (e) {
              toast.error(message);
            }
            hasErrors = true;
          }
        });
        if (!hasErrors) toast.error("Ошибка при изменении пароля");
      } else {
         toast.error("Ошибка при изменении пароля");
      }
      console.error(changeErr);
    }
  };

  const isPending = isChanging || isChecking;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Изменение пароля</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="currentPassword">Текущий пароль</Label>
          <Input
            id="currentPassword"
            type="password"
            {...register("currentPassword")}
            placeholder="Введите текущий пароль"
            className="mt-1.5"
          />
          {errors.currentPassword && <p className="text-sm text-red-500 mt-1">{errors.currentPassword.message}</p>}
        </div>

        <div>
          <Label htmlFor="newPassword">Новый пароль</Label>
          <Input
            id="newPassword"
            type="password"
            {...register("newPassword")}
            placeholder="Введите новый пароль"
            className="mt-1.5"
          />
          {errors.newPassword && (
             <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
          ) || (
             <p className="text-xs text-gray-500 mt-1">Пароль должен содержать минимум 8 символов</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="Подтвердите новый пароль"
            className="mt-1.5"
          />
          {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? "Изменение..." : "Сменить пароль"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
