import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Colecciones" },
  { href: "/customize", label: "Custom Shop" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-stone-300 sm:flex-row sm:items-center sm:justify-between">
        <Link className="logo-color-cycle text-lg font-bold uppercase tracking-widest" href="/">
          LUTHIER.IO
        </Link>

        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              className="rounded-md border border-transparent px-3 py-2 text-sm font-medium text-stone-300 transition-colors hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
