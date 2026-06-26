import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";

import { footerProfile } from "../config/profile";

const iconMap = {
  mail: FiMail,
  resume: FiFileText,
  github: FiGithub,
  linkedin: FiLinkedin,
} as const;

export function Footer() {
  return (
    <footer className="mx-auto mt-14 max-w-6xl px-5 pb-10 md:px-8">
      <div className="rounded-xl border border-ink-300 bg-white px-6 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="font-heading text-lg text-ink-900">{footerProfile.name}</h2>

          <div className="flex flex-wrap gap-3">
            {footerProfile.links.map((link) => {
              const Icon = iconMap[link.icon];
              const resolvedHref =
                link.icon === "mail" && !link.href.startsWith("mailto:")
                  ? `mailto:${link.href}`
                  : link.href;

              return (
                <a
                  key={link.label}
                  href={resolvedHref}
                  target={resolvedHref.startsWith("mailto:") ? undefined : "_blank"}
                  rel={resolvedHref.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-medium text-ink-800 transition hover:border-brand-500 hover:text-brand-600"
                >
                  <Icon />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-4 border-t border-ink-300 pt-3 text-xs text-ink-600">
          © {new Date().getFullYear()} {footerProfile.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
