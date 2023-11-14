import type { Metadata } from "next";
import "../globals.css";
import React from "react";
import ToasterComponent from "@/components/providers/ToasterComponent";

export const metadata: Metadata = {
  title: "meProgress - Create Post",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-slate-700">
        <div>{children}</div>
        <ToasterComponent />
      </body>
    </html>
  );
}
