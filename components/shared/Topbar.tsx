import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";
import UserButton from "./UserButton";
import NavMenu from "./NavMenu";

async function Topbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex p-5 justify-center items-center">
      <h1 className="text-xl mr-auto">meProgress</h1>

      <div className="flex gap-6 items-start justify-start">
        <NavMenu />

        <div className="flex gap-4">
          <DarkModeToggle />
          <UserButton session={session} />
        </div>
        {session ? (
          <p className="text-green-700 bg-green-300 px-4 py-2 rounded-md mt-auto">
            Admin User
          </p>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}

export default Topbar;
