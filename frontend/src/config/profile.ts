export interface ProfileLink {
  label: string;
  href: string;
  icon: "mail" | "resume" | "github" | "linkedin";
}

export interface FooterProfile {
  name: string;
  title: string;
  description: string;
  links: ProfileLink[];
}

export const footerProfile: FooterProfile = {
  name: "Samarth Negi",
  title: "AI Research Assistant Builder",
  description:
    "B.Tech CSE AIML 2026 | Building AI research assistants with FastAPI and CrewAI | Open to collaborations and opportunities",
  links: [
    {
      label: "Email",
      href: "samarthnegi91@gmail.com",
      icon: "mail",
    },
    {
      label: "Portfolio",
      href: "https://samarth91.vercel.app",
      icon: "resume",
    },
    {
      label: "GitHub",
      href: "https://github.com/samarth911",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/samarth91/",
      icon: "linkedin",
    },
  ],
};
