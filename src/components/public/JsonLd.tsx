import { SITE } from "@/lib/constants";

// Schema.org — lokalny klub sportowy (SportsActivityLocation).
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    image: `${SITE.url}/logo.jpg`,
    logo: `${SITE.url}/logo.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postalCode,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: SITE.areasServed.map((name) => ({ "@type": "City", name })),
    sport: "Boks",
    founder: { "@type": "Person", name: SITE.trainer },
    knowsAbout: ["Boks", "Trening bokserski", "Sztuki walki", "Kondycja"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.trainer,
    jobTitle: "Trener boksu",
    worksFor: { "@type": "Organization", name: SITE.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
