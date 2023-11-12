import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";
import UserButton from "./UserButton";
import NavMenu from "./NavMenu";
import Link from "next/link";

async function Topbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex py-6 px-8 justify-center items-center bg-white dark:bg-neutral-950 shadow-md">
      <h1 className="text-2xl mr-auto font-rubik tracking-tighter">
        me<span className="text-red-500 font-extralight">|</span>
        Progress
      </h1>

      <div className="flex gap-6 items-start justify-start">
        <NavMenu />

        <div className="flex gap-4 justify-center items-center">
          <DarkModeToggle />
        </div>
        {session ? (
          <ul className="flex gap-4 items-center justify-center">
            <li>
              <Link href="/create-post">Create Post</Link>
            </li>
            <li>
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
