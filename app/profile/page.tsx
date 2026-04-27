"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { selectUser } from "../auth/model/authSlice";

type TabType = "personal" | "social" | "password";

const Profile = () => {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  const tabs = [
    { id: "personal" as const, label: "Личная информация" },
    { id: "social" as const, label: "Социальные сети" },
    { id: "password" as const, label: "Пароль" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "social":
        return <SocialLinks />;
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
                  className="rounded-full object-none"
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
              <h3 className="font-semibold text-lg">Александр Иванов</h3>
              <p className="text-gray-500 text-sm">Архитектор</p>
            </div>

            {/* Навигация */}
            <nav className="space-y-2">
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full border-b cursor-pointer border-transparent flex items-center gap-3 py-3  transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? "border-primary!"
                          : "text-gray-700"
                      }
                    `}
                  >
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Правая панель - 60% */}
        <div className="md:w-[60%] lg:w-[65%]">
          <div className="p-6 md:p-8">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

// Компонент личной информации
const PersonalInfo = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Личная информация</h2>
      <form className="space-y-5">
        <div>
          <Label htmlFor="fullName">Полное имя</Label>
          <Input
            id="fullName"
            placeholder="Иванов Александр Петрович"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="alex@example.com"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="position">Должность</Label>
          <Input
            id="position"
            placeholder="Ведущий архитектор"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="company">Компания / Бюро</Label>
          <Input
            id="company"
            placeholder="Название компании"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="bio">О себе</Label>
          <Textarea
            id="bio"
            placeholder="Расскажите о своем опыте, проектах и интересах..."
            rows={4}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="specialization">Специализация</Label>
          <Input
            id="specialization"
            placeholder="Жилые комплексы, общественные здания"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="experience">Опыт работы (лет)</Label>
          <Input
            id="experience"
            type="number"
            placeholder="5"
            className="mt-1.5"
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Сохранить изменения
        </Button>
      </form>
    </div>
  );
};

// Компонент социальных сетей
const SocialLinks = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Социальные сети</h2>
      <form className="space-y-5">
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <div className="relative mt-1.5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              @
            </span>
            <Input id="instagram" placeholder="username" className="pl-8" />
          </div>
        </div>

        <div>
          <Label htmlFor="telegram">Telegram</Label>
          <div className="relative mt-1.5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              @
            </span>
            <Input id="telegram" placeholder="username" className="pl-8" />
          </div>
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/username"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="behance">Behance</Label>
          <Input
            id="behance"
            placeholder="https://behance.net/username"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="website">Личный сайт / Портфолио</Label>
          <Input
            id="website"
            placeholder="https://example.com"
            className="mt-1.5"
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Сохранить изменения
        </Button>
      </form>
    </div>
  );
};

// Компонент смены пароля
const ChangePassword = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Изменение пароля</h2>
      <form className="space-y-5">
        <div>
          <Label htmlFor="currentPassword">Текущий пароль</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Введите текущий пароль"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="newPassword">Новый пароль</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Введите новый пароль"
            className="mt-1.5"
          />
          <p className="text-xs text-gray-500 mt-1">
            Пароль должен содержать минимум 8 символов
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Подтвердите новый пароль"
            className="mt-1.5"
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Сменить пароль
        </Button>
      </form>
    </div>
  );
};

export default Profile;
