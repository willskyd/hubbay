"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { PhoneCall, ShoppingBag, User, User2, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { HUBBAY_PHONE } from "@/lib/constants";
import { formatNairaFromKobo } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWalletStore } from "@/store/wallet-store";

const customerLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/orders", label: "Orders" },
  { href: "/wallet", label: "Wallet" },
];

const adminLinks = [...customerLinks, { href: "/dashboard", label: "Dashboard" }];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const itemCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0),
  );
  const setOpen = useCartStore((state) => state.setOpen);
  const { balanceKobo, refresh, setBalance } = useWalletStore();

  useEffect(() => {
    if (status === "authenticated") {
      refresh();
      return;
    }
    if (status === "unauthenticated") {
      setBalance(0);
    }
  }, [refresh, setBalance, status]);

  const navLinks = isAdmin ? adminLinks : customerLinks;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-hubbay-gold/20 bg-hubbay-background/85 backdrop-blur-xl"
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link
          href="/"
          className="bg-emerald-gold bg-clip-text text-2xl font-extrabold tracking-tight text-transparent"
        >
          HUBBAY
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const baseHref = link.href.split("#")[0];
            const active =
              pathname === baseHref || (baseHref !== "/" && pathname.startsWith(`${baseHref}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-hubbay-emerald/12 text-hubbay-emerald shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35)]"
                    : "text-hubbay-secondary hover:bg-hubbay-surface hover:text-hubbay-text"
                }`}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-hubbay-gold" />
                ) : null}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={isAdmin ? "/auth/admin" : `tel:${HUBBAY_PHONE}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-hubbay-gold/35 bg-hubbay-surface/65 text-hubbay-emerald transition hover:border-hubbay-gold hover:text-hubbay-text md:h-auto md:w-auto md:gap-1 md:px-3 md:py-1.5 md:text-xs md:font-semibold"
            aria-label={isAdmin ? "Admin login" : "Contact HubBay"}
          >
            {isAdmin ? <User size={13} /> : <PhoneCall size={13} />}
            <span className="hidden md:inline">{isAdmin ? "Admin" : "Contact Us"}</span>
          </a>
          {session?.user ? (
            <Link
              href="/wallet"
              className="inline-flex items-center gap-1 rounded-full border border-hubbay-gold/35 bg-hubbay-surface/65 px-2.5 py-1.5 text-[11px] font-semibold text-hubbay-text transition hover:border-hubbay-gold md:px-3 md:text-xs"
            >
              <Wallet size={13} className="text-hubbay-gold" />
              {formatNairaFromKobo(balanceKobo)}
            </Link>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag size={15} />
            Cart
            <span className="ml-1 rounded-full bg-hubbay-gold/20 px-2 py-0.5 text-xs text-hubbay-gold">
              {itemCount}
            </span>
          </Button>
          {session?.user ? (
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <User2 size={15} />
              Sign out
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => signIn()}>
              <User2 size={15} />
              Sign in
            </Button>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
