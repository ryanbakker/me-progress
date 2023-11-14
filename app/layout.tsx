import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import FirebaseAuthProvider from "@/components/providers/FirebaseAuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Topbar from "@/components/shared/Topbar";
import { Rubik } from "next/font/google";
import ToasterComponent from "@/components/providers/ToasterComponent";

export const metadata: Metadata = {
  title: "meProgress",
  description: "Follow my progress",
};

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <html lang="en" className={`${rubik.variable}`}>
        <body className="flex flex-col min-h-full">
          <FirebaseAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Topbar />
              {children}
              <ToasterComponent />
            </ThemeProvider>
          </FirebaseAuthProvider>
        </body>
      </html>
    </ClientProviders>
  );
}
