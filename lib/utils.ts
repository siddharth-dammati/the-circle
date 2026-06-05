import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const BRANCHES = [
  "Computer Science Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Chemical Engineering",
  "Information Technology",
  "Data Science",
  "Artificial Intelligence & ML",
  "MBA",
  "B.Pharm",
  "M.Pharm",
  "BBA",
  "B.Com",
  "Other",
];

export const INTERESTS = [
  "Coding", "Music", "Gaming", "Fitness", "Photography",
  "Travel", "Reading", "Movies", "Art", "Dance",
  "Cricket", "Football", "Basketball", "Chess", "Cooking",
  "Anime", "Podcasts", "Entrepreneurship", "Design", "Finance",
  "Yoga", "Hiking", "Volunteering", "Poetry", "Theater",
];

export const CAMPUSES = [
  { value: "HYDERABAD", label: "Hyderabad" },
  { value: "BENGALURU", label: "Bengaluru" },
  { value: "VIZAG", label: "Vizag" },
];
