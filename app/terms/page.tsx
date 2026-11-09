import type { Metadata } from "next";
import TermsOfService from "@/components/Terms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of service | Hanowallet",
  description:
    "The terms that apply when you use Hanowallet's website, mining hardware, hosting and payout services.",
};

export default function TermsPage() {
  return (
    <>
    {/* <Navbar /> */}
    <TermsOfService />
    {/* <Footer />     */}
    </>
    )
}