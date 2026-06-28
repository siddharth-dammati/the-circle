import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Circle — Campus Dating, Hyderabad",
    template: "%s | The Circle",
  },
  description:
    "The Circle is an exclusive campus dating experience for Hyderabad students. Find your match before Freshers Day — August 28th.",
  keywords: ["GITAM", "campus dating", "freshers day", "hyderabad students", "college dating", "the circle"],
  openGraph: {
    title: "The Circle — Campus Dating, Hyderabad",
    description: "Build your profile. Find your match. Revealed on Freshers Day, Aug 28th.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Circle — Campus Dating, Hyderabad",
    description: "Build your profile. Find your match. Revealed on Freshers Day, Aug 28th.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
