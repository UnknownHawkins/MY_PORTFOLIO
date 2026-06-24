import type { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

interface GenerateSEOMetadataProps {
  title?: string;
  description?: string;
  url?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  url,
  ogImage,
  noIndex = false,
}: GenerateSEOMetadataProps = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;
  const metaDescription = description || SITE_CONFIG.description;
  const metaUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;
  const metaImage = ogImage || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: "Anubhav Singh" }],
    creator: "Anubhav Singh",
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: SITE_CONFIG.twitterHandle,
      images: [metaImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // Verification tokens if needed in the future
    verification: {},
  };
}

export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anubhav Singh",
    jobTitle: "Software Developer",
    url: SITE_CONFIG.url,
    sameAs: [
      "https://github.com/UnknownHawkins",
      "https://www.linkedin.com/in/anubhav-singh-aa800b307",
      "https://x.com/fav7659",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "GLA University, Mathura",
    },
    knowsAbout: [
      "Software Development",
      "Python",
      "Cybersecurity",
      "Web Development",
      "Java",
      "MySQL",
    ],
  };
}
