import { ReactNode } from "react";

export const Title = ({
  icon,
  children,
  className = "",
}: {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h1 className={`flex gap-4 text-3xl items-center ${className}`}>
      {icon}
      {children}
    </h1>
  );
};
