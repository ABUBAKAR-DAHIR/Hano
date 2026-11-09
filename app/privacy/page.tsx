import type { Metadata } from "next";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy policy | Hanowallet",
  description: "How Hanowallet collects, uses, shares and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
        {/* <Navbar /> */}
        <PrivacyPolicy />
        {/* <Footer /> */}
    </>
  )
}