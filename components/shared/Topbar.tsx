import { getServerSession } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";
import UserButton from "./UserButton";
import NavMenu from "./NavMenu";
import Link from "next/link";
import { Button } from "../ui/button";
import SignInButton from "./SignInButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HamburgerMenu from "./HamburgerMenu";

async function Topbar() {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user.email;
  const adminUser = process.env.ADMIN_EMAIL;

  const isAdmin = sessionUser === adminUser;

  return (
    <header className="flex py-6 px-4 lg:px-8 justify-center items-center bg-white dark:bg-neutral-950 shadow-md">
      <Link href="/" className="mr-auto">
        <h1 className="text-2xl font-rubik tracking-tighter">
          me<span className="text-red-500 font-extralight">|</span>
          Progress
        </h1>
      </Link>

      <div className="hidden md:flex gap-4 items-center justify-center">
        <NavMenu />

        <div className="flex justify-center items-center">
          <DarkModeToggle />
        </div>

        {session ? (
          <ul className="flex gap-4 items-center justify-center">
            {isAdmin && (
              <li>
                <Link href="/create-post">
                  <Button>Create Post</Button>
                </Link>
              </li>
            )}
            <li className="flex items-center justify-center">
              <UserButton session={session} />
            </li>
          </ul>
        ) : (
          <div>
            <SignInButton />
          </div>
        )}
      </div>
      <div className="md:hidden">
        <HamburgerMenu />
      </div>
    </header>
  );
}

export default Topbar;
