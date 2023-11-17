"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

function SignInButton() {
  const handleSignIn = () => {
    signIn();
  };

  return (
    <Button variant="outline" onClick={handleSignIn}>
      Sign In
    </Button>
  );
}

export default SignInButton;
