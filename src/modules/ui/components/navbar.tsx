import { auth } from "@/modules/auth/auth";
import Link from "next/link";
import { FaUserGroup } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineWork, MdWork } from "react-icons/md";

export const NavBar = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-foreground text-background flex gap-4 rounded-full fixed bottom-2 right-8 md:right-1/3 left-8 md:left-1/3 p-4 uppercase items-center justify-center">
      <Link href="/k-dashboard">
        <AiFillHome aria-label="Dashboard" />
      </Link>

      {session.user.isAdmin && (
        <Link href="/k-clients">
          <MdOutlineWork aria-label="Clients" />
        </Link>
      )}

      {session.user.isAdmin && (
        <Link href="/k-employees">
          <FaUserGroup aria-label="Employees" />
        </Link>
      )}
    </div>
  );
};
