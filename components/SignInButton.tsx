"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = { text: string };

const SignInButton = ({ text }: Props) => {
  return (
    <Button className="bg-emerald-500  text-white-400 hover:text-emerald-500 transition-all hover:scale-100">
      <Link href="/signin">
        {text}
      </Link>
    </Button>
  );
};

export default SignInButton;