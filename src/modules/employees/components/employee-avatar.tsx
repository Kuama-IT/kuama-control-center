import Image from "next/image";

export const EmployeeAvatar = ({
    avatarUrl,
    fullName,
    size = 20,
}: {
    avatarUrl: string | null | undefined;
    fullName: string | null | undefined;
    size?: number;
}) => {
    return (
        <div
            className="relative flex items-center justify-center overflow-hidden rounded-full bg-white"
            style={{ width: size, height: size }}
        >
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt={fullName ?? "Employee avatar"}
                    height={size}
                    width={size}
                />
            ) : (
                <span className="text-xs">{fullName?.at(0)}</span>
            )}
        </div>
    );
};
