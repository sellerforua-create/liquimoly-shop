"use client";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-400 mb-4 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-600">/</span>}
          {item.href
            ? <Link href={item.href} className="hover:text-white transition">{item.label}</Link>
            : <span className="text-gray-300">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
