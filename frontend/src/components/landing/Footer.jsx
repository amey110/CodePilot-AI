import { Code2, ExternalLink, FileText, User } from "lucide-react";

const links = [
  { label: "GitHub", href: "https://github.com", icon: Code2 },
  { label: "Portfolio", href: "#", icon: User },
  { label: "LinkedIn", href: "#", icon: ExternalLink },
  { label: "Documentation", href: "#", icon: FileText },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]" />
          <span className="text-sm font-semibold text-[#F8FAFC]">
            CodePilot AI
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-[#94A3B8]">
          © {new Date().getFullYear()} CodePilot AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
