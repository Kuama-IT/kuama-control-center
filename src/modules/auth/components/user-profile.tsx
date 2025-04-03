import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/modules/auth/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SignOutButton } from "@/modules/auth/components/sign-out-button";

export const UserProfile = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const user = session.user;
  return (
    <div className="hidden-print fixed top-0 m-4 right-0 z-10">
      <Popover>
        <PopoverTrigger className="cursor-pointer" asChild>
          <Avatar className="h-12 w-12">
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{user.name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent align="end" className="flex flex-col gap-2">
          <p>
            {user.name} ({user.isAdmin ? "Admin" : "Employee"})
          </p>

          <SignOutButton />
        </PopoverContent>
      </Popover>
    </div>
  );
};
