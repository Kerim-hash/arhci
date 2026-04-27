// components/CompetitionCard.tsx
import { Calendar, Eye, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Competition } from "@/types/competition";

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const isActive = competition.isActive;
  
  return (
    <Link href={`/work/competitions/${competition.slug}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={competition.image}
            alt={competition.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge className={isActive ? "bg-green-500" : "bg-gray-500"}>
              {isActive ? "Активный" : "Завершен"}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {competition.title}
          </h3>
          
          <p className="text-sm text-[#666666] mb-3 line-clamp-2">
            {competition.shortDescription}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-[#666666] mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{competition.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                До {new Date(competition.dates.submissionDeadline).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-[#666666] border-t pt-3 mt-auto">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{competition.participantsCount} участников</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{competition.views}</span>
            </div>
            <div className="font-medium text-green-600">
              {competition.prize}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}