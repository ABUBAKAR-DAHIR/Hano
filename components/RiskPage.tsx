import type { Metadata } from "next";
import Link from "next/link";
import Callout from "@/components/Callout";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { LEGAL } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Risk disclosure | Hanowallet",
  description: "The main risks of Bitcoin mining, including price volatility, network difficulty, hardware and regulation.",
};

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Before you start",
    content: (
      <>
        <p>
          Bitcoin mining can be rewarding, but it carries real financial risk. This page explains the main risks so you
          can make an informed decision before buying hardware or using our hosting and payout services.
        </p>
        <Callout tone="warning">
          <p>
            Only spend what you can afford to lose. Mining rewards are not guaranteed, and you could lose some or all of
            the money you put in.
          </p>
        </Callout>
        <p>
          This page doesn&rsquo;t cover every possible risk, and it isn&rsquo;t financial, investment, legal or tax
          advice. If you&rsquo;re unsure, speak to an independent professional.
        </p>
      </>
    ),
  },
  {
    id: "price",
    title: "Bitcoin price volatility",
    content: (
      <p>
        Mining rewards are paid in bitcoin, and Bitcoin&rsquo;s price can rise or fall sharply in a short time. A drop in
        price reduces the value of your rewards and can make mining unprofitable, even if your miner keeps running
        perfectly.
      </p>
    ),
  },
  {
    id: "difficulty",
    title: "Network difficulty and competition",
    content: (
      <p>
        The Bitcoin network adjusts its mining difficulty roughly every two weeks based on the total computing power
        competing for rewards. When more miners join, or more efficient machines come out, your share of the rewards gets
        smaller. Over time, the same miner usually earns less bitcoin.
      </p>
    ),
  },
  {
    id: "halving",
    title: "The halving",
    content: (
      <p>
        About every four years (every 210,000 blocks), the number of new bitcoin paid to miners per block is cut in half.
        Each halving can sharply reduce mining rewards overnight. Transaction fees make up part of miners&rsquo; income,
        but they vary and may not make up the difference.
      </p>
    ),
  },
  {
    id: "energy",
    title: "Energy and operating costs",
    content: (
      <p>
        Electricity is usually the biggest ongoing cost of mining. Changes in power prices, hosting fees, cooling costs or
        taxes can reduce or wipe out your profit. A miner that&rsquo;s profitable today may not be tomorrow.
      </p>
    ),
  },
  {
    id: "hardware",
    title: "Hardware risks",
    content: (
      <ul>
        <li>
          <strong>Breakdowns:</strong> miners can fail, overheat or need repairs, which causes downtime and extra costs.
        </li>
        <li>
          <strong>Obsolescence:</strong> newer, more efficient models are released regularly, making older machines less
          competitive.
        </li>
        <li>
          <strong>Resale value:</strong> the value of used miners can fall quickly, especially when Bitcoin&rsquo;s price
          drops or after a halving.
        </li>
        <li>
          <strong>Delivery:</strong> shipping delays, customs issues or supply shortages can delay when your miner starts
          earning.
        </li>
      </ul>
    ),
  },
  {
    id: "hosting",
    title: "Hosting and operational risks",
    content: (
      <p>
        Hosted miners depend on the facility&rsquo;s power, cooling and internet connection. Outages, maintenance,
        extreme weather, equipment failures or events outside our control can cause downtime and lost rewards. We work to
        keep miners running, but we can&rsquo;t guarantee uninterrupted operation.
      </p>
    ),
  },
  {
    id: "pools",
    title: "Mining pool risks",
    content: (
      <p>
        Rewards are earned through mining pools, which are operated by third parties. Pools can change their fees or
        payout rules, suffer outages or be affected by &ldquo;luck&rdquo;, which makes daily rewards go up and down.
      </p>
    ),
  },
  {
    id: "wallet",
    title: "Wallet and security risks",
    content: (
      <ul>
        <li>Bitcoin transactions can&rsquo;t be reversed. Payouts sent to a wrong address are usually lost for good.</li>
        <li>If you lose access to your wallet or its private keys, you may lose your bitcoin permanently.</li>
        <li>Phishing, malware and scams target crypto users. Never share your login details or private keys.</li>
      </ul>
    ),
  },
  {
    id: "regulation",
    title: "Legal and regulatory risks",
    content: (
      <p>
        Laws on cryptocurrency and mining differ between countries and can change quickly. New rules, taxes, energy
        restrictions or bans could affect your ability to mine, hold or sell bitcoin, or make mining less profitable.
        You&rsquo;re responsible for following the laws where you live.
      </p>
    ),
  },
  {
    id: "taxes",
    title: "Taxes",
    content: (
      <p>
        Mining rewards and selling bitcoin or hardware may be taxable where you live. You&rsquo;re responsible for
        understanding and paying any taxes that apply. We recommend speaking to a tax advisor.
      </p>
    ),
  },
  {
    id: "no-guarantee",
    title: "No guarantee of returns",
    content: (
      <>
        <p>
          Any figures we show, such as hashrate, efficiency, sample earnings or estimates, are for information only.
          They&rsquo;re based on assumptions that can change, and past results don&rsquo;t guarantee future earnings.
        </p>
        <p>
          We never promise profits or a return on investment. Please be wary of anyone who does, including people
          claiming to represent {LEGAL.company}.
        </p>
      </>
    ),
  },
  {
    id: "questions",
    title: "Questions",
    content: (
      <p>
        If you have questions about these risks or whether mining is right for you, email{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> or <Link href="/contact">contact our team</Link>. You can
        also read our <Link href="/terms">terms of service</Link> and <Link href="/faq">FAQ</Link>.
      </p>
    ),
  },
];

export default function RiskPage() {
  return (
    <LegalPage
      current="risk"
      title="Risk disclosure"
      description="Bitcoin mining comes with real risks. Here's what you should understand before you buy hardware or start mining with us."
      readingMinutes={5}
      summary={[
        "Mining rewards and profits are never guaranteed.",
        "Bitcoin's price, network difficulty and the halving can all reduce earnings.",
        "Hardware can break down or become outdated, and lose resale value.",
        "Only spend what you can afford to lose.",
      ]}
      sections={sections}
    />
  );
}