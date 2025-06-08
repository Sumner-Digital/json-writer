export interface Answers {
  brand: string;
  domain: string;
  logo: string;
  tagline: string;
  siteName: string;
  searchParam: string;
  social: string[];
  heroImg?: string;
  lang: string;
}

export function makeHomepageLd(a: Answers) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${a.domain}/#org`,
        name: a.brand,
        url: a.domain,
        logo: { "@type": "ImageObject", url: a.logo },
        sameAs: a.social
      },
      {
        "@type": "WebSite",
        "@id": `${a.domain}/#website`,
        url: `${a.domain}/`,
        name: a.siteName,
        potentialAction: {
          "@type": "SearchAction",
          target: `${a.domain}/${a.searchParam}{search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${a.domain}/#webpage`,
        url: `${a.domain}/`,
        headline: a.tagline,
        description: a.tagline,
        isPartOf: { "@id": `${a.domain}/#website` },
        primaryImageOfPage: { "@type": "ImageObject", url: a.heroImg },
        inLanguage: a.lang
      }
    ]
  };
}