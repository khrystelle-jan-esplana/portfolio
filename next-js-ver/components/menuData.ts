export type Sub = { label: string; id: string; href?: string };
export type MenuItem = { title: string; href: string; links: Sub[] };

// `id` is the #hash the destination page uses to open that section / planet.
// If a sub-link has its own `href`, it goes there instead (e.g. the tech-stack page).
export const menu: MenuItem[] = [
  { title: "about me", href: "/about", links: [
    { label: "introduction", id: "introduction" },
    { label: "interests", id: "interests" },
    { label: "hobbies", id: "hobbies" },
    { label: "skills", id: "skills" },
    { label: "tech stack", id: "tech-stack" },
    { label: "social media", id: "social-media" } ] },
  { title: "achievements", href: "/achievements", links: [
    { label: "leadership", id: "leadership" },
    { label: "competitions", id: "competitions" },
    { label: "award", id: "award" },
    { label: "scholarships", id: "scholarships" },
    { label: "course completions", id: "course-completions" } ] },
  { title: "certifications", href: "/certifications", links: [] },
  { title: "projects", href: "/projects", links: [
    { label: "capstone", id: "capstone" },
    { label: "IoT", id: "iot" },
    { label: "third year project", id: "third-year-project" }, ] },
  { title: "reach out", href: "/reach-out", links: [] },
];

export const subHref = (m: MenuItem, l: Sub) => l.href ?? `${m.href}#${l.id}`;