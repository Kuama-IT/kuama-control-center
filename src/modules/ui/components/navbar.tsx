import { auth } from "@/modules/auth/auth";
import Link from "next/link";
import { FaUserGroup } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineWork } from "react-icons/md";
import { routes } from "@/modules/ui/routes";
import { IoMdSettings } from "react-icons/io";

export const NavBar = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  return (
    <div className="hidden-print bg-foreground text-background flex gap-4 rounded-full fixed bottom-2 right-8 md:right-1/3 left-8 md:left-1/3 p-4 uppercase items-center justify-center">
      <Link href={routes.dashboard()}>
        <AiFillHome aria-label="Dashboard" />
      </Link>

      {session.user.isAdmin && (
        <Link href={routes.clients()}>
          <MdOutlineWork aria-label="Clients" />
        </Link>
      )}

      {session.user.isAdmin && (
        <Link href={routes.employees()}>
          <FaUserGroup aria-label="Employees" />
        </Link>
      )}

      {session.user.isAdmin && (
        <Link href={routes.settings()}>
          <IoMdSettings aria-label="Settings" />
        </Link>
      )}
    </div>
  );
};
