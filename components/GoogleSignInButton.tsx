"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const GoogleSignInButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  return (
    <Button
      onClick={() => signIn("google", { callbackUrl })}
      variant="outline"
      className="flex gap-1"
    >
      <Image
        src="/assets/icons/googleLight.svg"
        alt="Google"
        width={35}
        height={35}
        className="rounded-full"
      />
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
