import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow — Task Management",
  description: "A production-ready task manager with secure authentication and team collaboration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-950 text-gray-100 antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e2130",
              color: "#e2e8f0",
              border: "1px solid #2d3748",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#4f6ef7", secondary: "#fff" } },
            error: { iconTheme: { primary: "#f56565", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
