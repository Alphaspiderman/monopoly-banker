import { Navbar } from "@/components/custom/navbar";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const entries = [
    { name: "Home", href: "/" },
    { name: "Setup", href: "/setup" },
    { name: "Play", href: "/game" },
  ];

  return (
    <section>
      <Navbar entries={entries} />
      {children}
    </section>
  );
}
