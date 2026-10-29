import FindIdForm from "@/components/auth/FindIdForm";
import { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "JWT Find Id",
  description: "JWT Find Id",
};

export default function FindIdPage() {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          <FindIdForm />;
        </div>
      </ThemeProvider>
    </div>
  )
}