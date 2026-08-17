"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { tokenStorage } from "@/hooks/storage";
import { apiSlice } from "@/services/api";
import {
  useToggleProjectLikeMutation,
  useToggleSpecialistLikeMutation,
} from "@/app/store/features/authApi";

function likesLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "лайк";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "лайка";
  return "лайков";
}

interface LikeButtonProps {
  target: "project" | "specialist";
  targetId: number;
  initialLikes: number;
  initialIsLiked?: boolean;
  className?: string;
}

export default function LikeButton({
  target,
  targetId,
  initialLikes,
  initialIsLiked = false,
  className,
}: LikeButtonProps) {
  const dispatch = useDispatch();
  const [toggleProjectLike, { isLoading: isProjectLoading }] =
    useToggleProjectLikeMutation();
  const [toggleSpecialistLike, { isLoading: isSpecialistLoading }] =
    useToggleSpecialistLikeMutation();
  const [state, setState] = useState<{
    likes: number;
    isLiked: boolean;
  } | null>(null);

  const likes = state?.likes ?? initialLikes;
  const isLiked = state?.isLiked ?? initialIsLiked;
  const isLoading = isProjectLoading || isSpecialistLoading;

  const handleClick = async () => {
    if (!tokenStorage.getAccessToken()) {
      toast.error("Войдите, чтобы поставить лайк");
      return;
    }
    try {
      const toggle =
        target === "project" ? toggleProjectLike : toggleSpecialistLike;
      const result = await toggle(targetId).unwrap();
      setState(result);
      dispatch(
        apiSlice.util.invalidateTags([
          target === "project" ? "Projects" : "Specialists",
        ]),
      );
    } catch (error) {
      const detail = (error as { data?: { detail?: string } }).data?.detail;
      toast.error(detail ?? "Не удалось поставить лайк");
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isLiked ? "default" : "outline"}
      size="lg"
      disabled={isLoading}
      className={`gap-2 ${isLiked ? "bg-red-500 hover:bg-red-600" : ""} ${className ?? ""}`}
    >
      <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
      {likes} {likesLabel(likes)}
    </Button>
  );
}
