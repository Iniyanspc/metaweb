import type { StaticImageData } from "next/image";
import capAi from "@/assets/images/cap-ai.jpg";
import capAiScreen from "@/assets/images/cap-ai-screen.jpg";
import capAnalytics from "@/assets/images/cap-analytics.jpg";
import capApplications from "@/assets/images/cap-applications.jpg";
import capDataEngineering from "@/assets/images/cap-data-engineering.jpg";
import capManaged from "@/assets/images/cap-managed.jpg";
import capTransformation from "@/assets/images/cap-transformation.jpg";
import heroCode from "@/assets/images/hero-code.jpg";
import heroTeam from "@/assets/images/hero-team.jpg";
import industryCustom from "@/assets/images/industry-custom.jpg";
import industryEducation from "@/assets/images/industry-education.jpg";
import industryHealthcare from "@/assets/images/industry-healthcare.jpg";
import industryHr from "@/assets/images/industry-hr.jpg";
import industryLogistics from "@/assets/images/industry-logistics.jpg";
import libraryOld from "@/assets/images/library-old.jpg";
import officeFloor from "@/assets/images/office-floor.jpg";
import officeHallway from "@/assets/images/office-hallway.jpg";
import officeOpen from "@/assets/images/office-open.jpg";
import problemCables from "@/assets/images/problem-cables.jpg";
import processWhiteboard from "@/assets/images/process-whiteboard.jpg";

/**
 * Photography registry. Content in data/ refers to images by key, so a CMS can
 * later supply URLs instead. All photos are from Unsplash (free to use under
 * the Unsplash License); sources are listed in assets/images/CREDITS.md.
 * Never use photos of people to represent the metadatum team or clients.
 */
export const IMAGES = {
  "hero-team": { src: heroTeam, alt: "Four people working together around a laptop in a bright office" },
  "hero-code": { src: heroCode, alt: "Two engineers reviewing code on monitors" },
  "problem-cables": { src: problemCables, alt: "A tangle of network cables in a server rack" },
  "cap-data-engineering": { src: capDataEngineering, alt: "Fibre optic cables connected to network equipment" },
  "cap-ai": { src: capAi, alt: "Code on a laptop screen in a dark room" },
  "cap-ai-screen": { src: capAiScreen, alt: "Close-up of Python code on a screen" },
  "cap-analytics": { src: capAnalytics, alt: "Analytics charts on a laptop screen" },
  "cap-applications": { src: capApplications, alt: "An engineer writing code at a desk in an office" },
  "cap-transformation": { src: capTransformation, alt: "A person sketching a workflow strategy on a whiteboard" },
  "cap-managed": { src: capManaged, alt: "A monitoring screen showing live metrics" },
  "process-whiteboard": { src: processWhiteboard, alt: "Two people mapping a process on a whiteboard" },
  "industry-education": { src: industryEducation, alt: "A bright library with tall windows and study tables" },
  "industry-healthcare": { src: industryHealthcare, alt: "A clean hospital corridor" },
  "industry-logistics": { src: industryLogistics, alt: "Workers walking through a large warehouse" },
  "industry-hr": { src: industryHr, alt: "Colleagues reviewing documents together at a table" },
  "industry-custom": { src: industryCustom, alt: "A modern office building against a clear sky" },
  "office-open": { src: officeOpen, alt: "People working in a large open-plan office" },
  "office-hallway": { src: officeHallway, alt: "A glass-walled office corridor" },
  "office-floor": { src: officeFloor, alt: "An empty open-plan office with rows of desks" },
  "library-old": { src: libraryOld, alt: "Students studying in a large traditional library" },
} satisfies Record<string, { src: StaticImageData; alt: string }>;

export type ImageKey = keyof typeof IMAGES;

export function isImageKey(key: string | undefined): key is ImageKey {
  return Boolean(key && key in IMAGES);
}
