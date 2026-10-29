import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "JWT Sign In",
  description: "JWT Sign In",
};

export default function SignInPage() {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          <SignInForm />;
        </div>
      </ThemeProvider>
    </div>
  )
}