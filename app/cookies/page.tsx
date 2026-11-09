import type { Metadata } from "next";
import CookiePolicy from "@/components/CookiePolicy";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie policy | Hanowallet",
  description: "What cookies are, which ones the Hanowallet website uses and how you can control them.",
};

export default function CookiesPage() {
  return (
    <>
        {/* <Navbar /> */}
        <CookiePolicy />
        {/* <Footer /> */}
    </>
  )
}