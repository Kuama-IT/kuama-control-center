"use client";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

export const BackButton = () => {
  const router = useRouter();

  return (
    <div className="cursor-pointer transition-all hover:scale-110">
      <ArrowLeftIcon onClick={() => router.back()} />
    </div>
  );
};
