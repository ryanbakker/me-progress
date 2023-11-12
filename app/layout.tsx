import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import FirebaseAuthProvider from "@/components/providers/FirebaseAuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Topbar from "@/components/shared/Topbar";

export const metadata: Metadata = {
  title: "meProgress",
  description: "Follow my progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <html lang="en">
        <body className="flex flex-col">
          <FirebaseAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Topbar />
              {children}
            </ThemeProvider>
          </FirebaseAuthProvider>
        </body>
      </html>
    </ClientProviders>
  );
}
