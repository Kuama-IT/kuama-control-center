"use client";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

export const BackButton = () => {
  const router = useRouter();

  return <ArrowLeftIcon onClick={() => router.back()} />;
};
