import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GITAMate — Find Your Campus Connection",
    template: "%s | GITAMate",
  },
  description:
    "GITAMate is an exclusive social discovery platform for verified GITAM University students. Find friends, study partners, and meaningful connections.",
  keywords: ["GITAM", "campus", "social", "students", "university", "networking", "friends", "study partner"],
  openGraph: {
    title: "GITAMate — Find Your Campus Connection",
    description: "Meet verified GITAM students who share your interests, goals, and passions.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "GITAMate — Find Your Campus Connection",
    description: "Meet verified GITAM students who share your interests, goals, and passions.",
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
