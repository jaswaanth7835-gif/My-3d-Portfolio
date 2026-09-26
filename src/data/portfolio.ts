export const profile = {
  name: "Jaswaanth Narayanasamy",
  title: "Cybersecurity Undergraduate · Aspiring SOC Analyst",
  location: "Hendala, Sri Lanka",
  bio: "I'm a cybersecurity undergraduate at APIIT (University of Staffordshire) with a strong interest in security operations. I like finding out what happened on a system and why, whether that means digging through logs, investigating an incident or testing defences in my own lab. I'm working toward a SOC Analyst role, and I practise hands-on with Kali Linux, Metasploit and Linux networking.",
  education: "BSc (Hons) Cyber Security · APIIT Sri Lanka × University of Staffordshire · Level 5 · Expected 2028",
  email: "Jaswaanth7835@gmail.com",
  github: "https://github.com/jaswaanth7835-gif",
  linkedin: "https://www.linkedin.com/in/jaswaanth-narayanasamy7835/",
  resume: "/Jaswaanth_Narayanasamy_CV.pdf",
  photo: "/img/jaswaanth.jpg",
};

export type Project = {
  title: string;
  meta: string;
  description: string;
  tech: string[];
  live?: string;
  github?: string;
  images?: string[];
};

export const projects: Project[] = [
  {
    title: "Altrium: Performance Tracker",
    meta: "Group project · 4 members · 2026",
    description:
      "HR review platform with 360° feedback, role-based access, development plans and audit logs. Live on Railway.",
    tech: ["Python", "Django", "MySQL", "Bootstrap", "Railway"],
    live: "https://altrium-performance-tracker-production.up.railway.app",
    github: "https://github.com/jaswaanth7835-gif/Altrium-Performance-Tracker",
  },
  {
    title: "GreenBite",
    meta: "Web development · 2025",
    description:
      "Multi-page healthy-living website with a recipe browser, workout planner, calculator, mindfulness page and contact form.",
    tech: ["JavaScript", "HTML", "CSS"],
    live: "https://jaswaanth7835-gif.github.io/greenbite/",
    github: "https://github.com/jaswaanth7835-gif/greenbite",
  },
  {
    title: "Software Development: Web",
    meta: "Coursework · 2025",
    description:
      "Front-end coursework covering an events page, a validated form and an interactive profile card.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/jaswaanth7835-gif/SoftwareDevelopment-Web-",
  },
  {
    title: "Heart Disease Analytics Dashboard",
    meta: "Data analytics · 2026",
    description:
      "Interactive Power BI dashboard exploring 920 patient records to spot heart disease risk patterns.",
    tech: ["Power BI", "Power Query", "DAX", "Star schema"],
    images: ["/img/heart-dashboard-1.png", "/img/heart-dashboard-2.png"],
  },
  {
    title: "AWS Cloud Architecture: MedSys Health",
    meta: "Cloud · 2026",
    description:
      "Designed a secure multi-AZ AWS setup for a fictional healthcare company, with S3 as the deep dive.",
    tech: ["AWS", "VPC", "S3", "draw.io"],
  },
  {
    title: "Home Security Lab",
    meta: "Personal · Ongoing",
    description:
      "Personal pentesting lab for practising attacks and defences safely.",
    tech: ["Kali Linux", "VMware", "Metasploit", "Metasploitable 2", "DC-1"],
  },
];

export const skills: Record<string, string[]> = {
  Security: ["Kali Linux", "Metasploit", "VMware", "Networking basics"],
  Languages: ["Python", "JavaScript", "HTML/CSS", "SQL", "C/C++"],
  Frameworks: ["Django", "Bootstrap"],
  Data: ["Power BI", "Power Query", "DAX"],
  "Cloud & DevOps": ["AWS", "Railway", "Git/GitHub", "Linux"],
  Tools: ["VS Code", "draw.io"],
};
