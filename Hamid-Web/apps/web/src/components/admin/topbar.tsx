import Image from "next/image";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

export function AdminTopbar({ name, email, onOpenNav }: { name: string; email: string; onOpenNav?: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-outline-variant/60 bg-surface-container-lowest px-4 md:px-6">
      <div className="flex items-center gap-3">
        {onOpenNav && (
          <button type="button" onClick={onOpenNav} className="text-on-surface-variant md:hidden" aria-label="Open menu">
            <Menu size={22} />
          </button>
        )}
        <Link href="/admin" className="flex items-center gap-2 md:hidden">
          <Image src="/brand/logo-icon-cropped.svg" alt="Hamid Afandi" width={26} height={24} className="h-6 w-auto object-contain" priority />
          <span className="font-display text-base font-bold text-on-surface">Hamid Afandi</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/admin/account" className="rounded-lg px-2 py-1 text-end hover:bg-surface-container" title="My account">
          <p className="text-sm font-semibold text-on-surface">{name}</p>
          <p className="text-xs text-on-surface-variant">{email}</p>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </form>
      </div>
    </header>
  );
}
