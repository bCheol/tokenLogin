import UserProfile from "@/components/user-profile/UserProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Profile",
  description: "JWT Profile",
};

export default function ProfilePage() {
  return (
    <div>
      <UserProfile />
    </div>
  );
}