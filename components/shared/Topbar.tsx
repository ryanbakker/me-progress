import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";
import UserButton from "./UserButton";
import NavMenu from "./NavMenu";
import Link from "next/link";
import { Button } from "../ui/button";

async function Topbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex py-6 px-8 justify-center items-center bg-white dark:bg-neutral-950 shadow-md">
      <Link href="/" className="mr-auto">
        <h1 className="text-2xl font-rubik tracking-tighter mr-4">
          me<span className="text-red-500 font-extralight">|</span>
          Progress
        </h1>
      </Link>

      <div className="flex gap-4 items-center justify-center">
        <NavMenu />

        <div className="flex justify-center items-center">
          <DarkModeToggle />
        </div>
        {session ? (
          <ul className="flex gap-4 items-center justify-center">
            <li>
              <Link href="/create-post">
                <Button>Create Post</Button>
              </Link>
            </li>
            <li className="flex items-center justify-center">
              <UserButton session={session} />
            </li>
          </ul>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}

export default Topbar;
