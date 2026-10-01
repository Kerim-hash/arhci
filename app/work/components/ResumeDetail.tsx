// components/ResumeDetail.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ResumeDetailRead } from "@/services/generatedApi";
import RichContent from "@/components/content/RichContent";
import { asStringArray, formatSalaryRange } from "../model/format";

interface ResumeDetailProps {
  resume: ResumeDetailRead;
}

export function ResumeDetailComponent({ resume }: ResumeDetailProps) {
  const salary = formatSalaryRange(resume.salaryFrom, resume.salaryTo);
  const socialLinks = asStringArray(resume.socialLinks);
  const keySkills = asStringArray(resume.keySkills);
  const phone = resume.phone?.trim() || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="p-0!">
          <BreadcrumbItem>
            <BreadcrumbLink href="/work">Работа</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/work?tab=resumes">Резюме</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-8">
        {/* Основная карточка */}
        <Card>
          <CardContent className="p-0! space-y-5">
            {/* Аватар и имя */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                {resume.avatar ? (
                  <Image
                    src={resume.avatar}
                    alt={resume.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {resume.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold">{resume.name}</h1>
                {resume.category && (
                  <p className="text-[#949494] text-sm">{resume.category}</p>
                )}
              </div>
            </div>

            {/* Зарплата и опыт */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="font-semibold">{salary ?? "Зарплата не указана"}</div>
              {resume.experience && (
                <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                  <span className="text-sm">Опыт {resume.experience}</span>
                </div>
              )}
            </div>

            {/* Информационная таблица */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">Место работы</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {resume.workPlace || "Не указано"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">Занятость</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {resume.employment || "Не указана"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[16px] text-[#333333]">График</div>
                <div className="text-[#333333] text-[16px] font-medium">
                  {resume.schedule || "Не указан"}
                </div>
              </div>
              {phone && (
                <div className="flex items-center justify-between">
                  <div className="text-[16px] text-[#333333]">Телефон</div>
                  <div className="text-[#333333] text-[16px] font-medium">
                    📞 {phone}
                  </div>
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-[16px] text-[#333333]">
                    Социальные сети
                  </div>
                  <div className="flex items-center gap-2">
                    {socialLinks.map((link, index) => (
                      <span
                        key={index}
                        title={link}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs"
                      >
                        {link.charAt(0).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {resume.email && (
                <div className="flex items-center justify-between">
                  <div className="text-[16px] text-[#333333]">
                    Электронная почта
                  </div>
                  <div className="text-[#333333] text-[16px] font-medium">
                    {resume.email}
                  </div>
                </div>
              )}
            </div>

            {phone ? (
              <Button asChild className="rounded-[40px] w-fit">
                <a href={`tel:${phone}`}>Связаться</a>
              </Button>
            ) : resume.email ? (
              <Button asChild className="rounded-[40px] w-fit">
                <a href={`mailto:${resume.email}`}>Связаться</a>
              </Button>
            ) : null}
          </CardContent>
        </Card>

        {/* О себе */}
        {resume.about && (
          <div>
            <h2 className="text-xl font-semibold mb-4">О себе</h2>
            <Separator className="mb-4" />
            <RichContent
              className="ck-content text-gray-700 leading-relaxed"
              html={resume.about || ""}
            />
          </div>
        )}

        {/* Опыт */}
        {resume.workExperience && resume.workExperience.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Опыт</h2>
            <Separator className="mb-6" />
            <div className="space-y-8">
              {resume.workExperience.map((exp) => {
                const duties = asStringArray(exp.duties);
                return (
                  <Card key={exp.id}>
                    <CardContent className="p-0!">
                      <h3 className="font-semibold text-lg mb-1">
                        {exp.company}
                      </h3>
                      {exp.position && (
                        <p className="text-sm text-gray-700 mb-1">{exp.position}</p>
                      )}
                      <p className="text-[#949494] text-sm mb-4">
                        {exp.startDate} — {exp.endDate}
                      </p>
                      {duties.length > 0 && (
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                          {duties.map((duty, i) => (
                            <li key={i}>{duty}</li>
                          ))}
                        </ul>
                      )}
                      {exp.achievement && (
                        <p className="text-sm text-gray-700 mt-3">
                          <span className="font-medium">Достижение:</span>{" "}
                          {exp.achievement}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Ключевые навыки */}
        {keySkills.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ключевые навыки</h2>
            <Separator className="mb-4" />
            <div className="flex flex-wrap gap-2">
              {keySkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm py-1 px-3"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
