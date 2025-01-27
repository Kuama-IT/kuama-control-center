import { ReactNode } from "react";

export const Title = ({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <h1 className="flex gap-4 text-3xl items-center">
      {icon}
      {children}
    </h1>
  );
};
