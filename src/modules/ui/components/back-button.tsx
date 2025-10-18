"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackButton = () => {
    const router = useRouter();

    return (
        <div className="cursor-pointer transition-all hover:scale-110">
            <ArrowLeftIcon onClick={() => router.back()} />
        </div>
    );
};
