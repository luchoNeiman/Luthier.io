import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categorias" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-stone-800 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-lg font-semibold tracking-tight text-stone-900" href="/">
          Luthier.io
        </Link>

        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              className="rounded-md border border-transparent px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-amber-500/50 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
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
