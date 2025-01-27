import Image from "next/image";
import Link from "next/link";

export const EmployeeAvatar = ({
  employee: { avatarUrl, fullName, id },
}: {
  employee: { avatarUrl: null | string; fullName: null | string; id: number };
}) => {
  return (
    <Link
      className="cursor-pointer relative group flex items-center justify-center hover:z-10"
      href={`/employees/${id}`}
    >
      <div className="aspect-square h-8 w-8 rounded-lg overflow-hidden">
        {avatarUrl && (
          <Image src={avatarUrl} alt={fullName ?? ""} width={40} height={40} />
        )}
      </div>
      <p className="absolute left-2 p-2 rounded bg-background text-foreground text-xs whitespace-nowrap pointer-events-none opacity-0 -translate-y-full group-hover:opacity-100 transition-all group-hover:-translate-y-full group-hover:translate-x-2">
        {fullName}
      </p>
    </Link>
  );
};
