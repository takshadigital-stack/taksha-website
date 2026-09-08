/**
 * Projects Content — All 9 Studio Originals
 * PRD §12.0–12.9
 * Phase 13 Structure: 13-point long-form case studies.
 */

export const CATEGORIES = [
  'All',
  'Brand Identity',
  'UI/UX',
  'Website',
  'Dashboard/SaaS',
  'AI Automation',
  'Healthcare',
  'SaaS',
  'Hospitality',
  'Real Estate',
  'Fintech',
  'Retail/Lifestyle',
];

/* 
  Reusable empty 13-section boilerplate for concept projects that are not yet fully populated.
*/
const _emptyCaseStudy = {
  brief: "Project brief to be documented.",
  challenge: "The primary challenge and constraints to be documented.",
  research: {
    summary: "Research phase findings.",
    keyInsights: ["Insight 1", "Insight 2", "Insight 3"]
  },
  personas: [
    { name: "Primary User", role: "Role", goals: "User goals...", frustrations: "User frustrations..." }
  ],
  informationArchitecture: "IA methodology and mapping.",
  userFlows: "Core user flows.",
  wireframes: "Wireframing process.",
  uiDesign: "UI design and high-fidelity rendering approach.",
  componentSystem: "Design system and token generation.",
  motionDesign: "Motion and interaction guidelines.",
  accessibility: "WCAG compliance strategy.",
  performance: {
    score: "90+",
    details: "Performance optimizations and Lighthouse metrics."
  },
  lessonsLearned: ["Lesson 1", "Lesson 2"]
};

export const allProjects = [];

export function getProjectBySlug(slug) {
  return allProjects.find((p) => p.slug === slug);
}
