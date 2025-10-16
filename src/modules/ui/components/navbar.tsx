import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { BiSolidBank } from "react-icons/bi";
import { FaShop, FaUserGroup } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineWork } from "react-icons/md";
import { auth } from "@/modules/auth/auth";
import { BrutalCard } from "@/modules/ui";
import { routes } from "@/modules/ui/routes";

const iconSize = 28;
export const NavBar = async () => {
    const session = await auth();
    if (!session?.user) {
        return null;
    }

    return (
        <div className="hidden-print fixed right-8 bottom-2 left-8 bg-background md:right-1/3 md:left-1/3">
            <BrutalCard>
                <div className="flex items-center justify-center gap-4">
                    <Link href={routes.dashboard()}>
                        <AiFillHome size={iconSize} aria-label="Dashboard" />
                    </Link>

                    {session.user.isAdmin && (
                        <Link href={routes.clients()}>
                            <MdOutlineWork
                                size={iconSize}
                                aria-label="Clients"
                            />
                        </Link>
                    )}

                    {session.user.isAdmin && (
                        <Link href={routes.employees()}>
                            <FaUserGroup
                                size={iconSize}
                                aria-label="EmployeeList"
                            />
                        </Link>
                    )}

                    {session.user.isAdmin && (
                        <Link href={routes.cashFlows()}>
                            <BiSolidBank
                                size={iconSize}
                                aria-label="CashFlow"
                            />
                        </Link>
                    )}

                    {session.user.isAdmin && (
                        <Link href={routes.suppliers()}>
                            <FaShop size={iconSize} aria-label="CashFlow" />
                        </Link>
                    )}

                    {session.user.isAdmin && (
                        <Link href={routes.settings()}>
                            <IoMdSettings
                                size={iconSize}
                                aria-label="Settings"
                            />
                        </Link>
                    )}
                </div>
            </BrutalCard>
        </div>
    );
};
