// Helper function to check if a value is empty
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') {
    // Check if all properties are empty
    return Object.values(value).every(v => isEmpty(v));
  }
  return false;
}

// Helper function to build schema objects conditionally
function buildSchemaObject(obj: any): any | undefined {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }
  
  const result: any = {};
  let hasContent = false;

  for (const [key, value] of Object.entries(obj)) {
    // Always include @type and @context
    if (key === '@type' || key === '@context') {
      result[key] = value;
      continue;
    }

    // Skip @id if domain is empty (assuming @id is derived from domain)
    if (key === '@id' && typeof value === 'string' && value.includes('//') && isEmpty(value)) {
       continue;
    }


    // Handle nested objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nested = buildSchemaObject(value);
      if (nested && Object.keys(nested).length > 0) { // Include if not empty after cleaning
        result[key] = nested;
        hasContent = true;
      }
    } else if (!isEmpty(value)) {
      result[key] = value;
      hasContent = true;
    }
  }

  // Return undefined if object only has @type (no actual content)
  if (!hasContent && result['@type']) {
     // Check if there are other keys besides @type
     if (Object.keys(result).filter(k => k !== '@type').length === 0) {
         return undefined;
     }
  }

  return hasContent || result['@context'] ? result : undefined;
}

// Helper function to build an ImageObject schema
function buildImageObject(data: any): any | undefined {
    if (!data || isEmpty(data.url)) {
        return undefined;
    }
    const imageObject: any = { "@type": "ImageObject" };
    if (data.url) imageObject.url = data.url;
    // Add other image object properties from schema if any
    return imageObject;
}

// Helper function to build a PostalAddress schema
function buildAddress(data: any): any | undefined {
     if (!data || (isEmpty(data.streetAddress) && isEmpty(data.addressLocality) && isEmpty(data.addressRegion) && isEmpty(data.postalCode) && isEmpty(data.addressCountry))) {
         return undefined;
     }
     const address: any = { "@type": "PostalAddress" };
     if (data.streetAddress) address.streetAddress = data.streetAddress;
     if (data.addressLocality) address.addressLocality = data.addressLocality;
     if (data.addressRegion) address.addressRegion = data.addressRegion;
     if (data.postalCode) address.postalCode = data.postalCode;
     if (data.addressCountry) address.addressCountry = data.addressCountry;
     return address;
}

// Helper function to build a Person schema
function buildPerson(data: any): any | undefined {
    if (!data || isEmpty(data.name)) {
        return undefined;
    }
    const person: any = { "@type": "Person" };
    if (data.name) person.name = data.name;
    // Add other person properties from schema if any
    return person;
}

// Helper function to build a ContactPoint schema
function buildContactPoint(data: any): any | undefined {
    if (!data || (isEmpty(data.contactType) && isEmpty(data.telephone) && isEmpty(data.email) && isEmpty(data.areaServed))) {
        return undefined;
    }
    const contactPoint: any = { "@type": "ContactPoint" };
    if (data.contactType) contactPoint.contactType = data.contactType;
    if (data.telephone) contactPoint.telephone = data.telephone;
    if (data.email) contactPoint.email = data.email;
    if (data.areaServed) contactPoint.areaServed = data.areaServed;
    return contactPoint;
}

// Helper function to build a SearchAction schema
function buildSearchAction(data: any): any | undefined {
    if (!data || isEmpty(data.domain) || isEmpty(data.searchParam)) {
        return undefined;
    }
    const searchAction: any = {
        "@type": "SearchAction",
        target: `${data.domain}/${data.searchParam}{search_term_string}`,
        "query-input": "required name=search_term_string"
    };
    return searchAction;
}


// Helper function to build Organization or LocalBusiness schema
function buildOrganization(data: any): any | undefined {
    // Check if any relevant data exists for Organization/LocalBusiness
    if (isEmpty(data.brand) && isEmpty(data.domain) && isEmpty(data.email) && isEmpty(data.telephone) && isEmpty(data.address) && isEmpty(data.foundingDate) && isEmpty(data.founder) && isEmpty(data.alternateName) && isEmpty(data.award) && isEmpty(data.hasMap) && isEmpty(data.social) && isEmpty(data.description) && isEmpty(data.contactPoint)) {
        return undefined;
    }

    const org: any = { "@type": data['@type'] === 'LocalBusiness' ? 'LocalBusiness' : 'Organization' };

    if (data.domain) {
        org["@id"] = `${data.domain}/#org`;
        org.url = data.domain;
    }
    if (data.brand) org.name = data.brand;
    if (data.logo) {
        const logo = buildImageObject({ url: data.logo });
        if (logo) org.logo = logo;
    }
    if (data.social && Array.isArray(data.social) && data.social.length > 0) {
        org.sameAs = data.social.filter((s: string) => s && s.trim() !== '');
    }
    if (data.email) org.email = data.email;
    if (data.telephone) org.telephone = data.telephone;
    if (data.address && !isEmpty(data.address)) {
        const address = buildAddress(data.address);
        if (address) org.address = address;
    }
    if (data.foundingDate) org.foundingDate = data.foundingDate;
    if (data.founder && !isEmpty(data.founder)) {
         const founder = buildPerson(data.founder);
         if (founder) org.founder = founder;
    }
    if (data.alternateName) org.alternateName = data.alternateName;
    if (data.award) org.award = data.award;
    if (data.hasMap) org.hasMap = data.hasMap;
    if (data.description) org.description = data.description;
    if (data.contactPoint && !isEmpty(data.contactPoint)) {
        const contactPoint = buildContactPoint(data.contactPoint);
        if (contactPoint) org.contactPoint = contactPoint;
    }

    return org;
}

// Helper function to build WebSite schema
function buildWebSite(data: any): any | undefined {
    if (isEmpty(data.domain) && isEmpty(data.siteName) && isEmpty(data.searchParam)) {
        return undefined;
    }
    const website: any = { "@type": "WebSite" };
    if (data.domain) {
        website["@id"] = `${data.domain}/#website`;
        website.url = `${data.domain}/`;
    }
    if (data.siteName) website.name = data.siteName;
    if (data.searchParam && data.domain) {
        const searchAction = buildSearchAction({ domain: data.domain, searchParam: data.searchParam });
        if (searchAction) website.potentialAction = searchAction;
    }
    return website;
}

// Helper function to build WebPage schema
function buildWebPage(data: any): any | undefined {
    // Check if any relevant data exists for WebPage
    if (isEmpty(data.domain) && isEmpty(data.tagline) && isEmpty(data.heroImg) && isEmpty(data.lang) && isEmpty(data.webPage) && isEmpty(data.publisher) && isEmpty(data.copyrightHolder) && isEmpty(data.copyrightYear) && isEmpty(data.datePublished) && isEmpty(data.dateModified)) {
        return undefined;
    }

    const webpage: any = { "@type": "WebPage" };

    if (data.domain) {
        webpage["@id"] = `${data.domain}/#webpage`;
        webpage.url = `${data.domain}/`;
        webpage.isPartOf = { "@id": `${data.domain}/#website` };
    }
    if (data.tagline) {
        webpage.headline = data.tagline;
        webpage.description = data.tagline;
    }
    if (data.heroImg) {
        const primaryImageOfPage = buildImageObject({ url: data.heroImg });
        if (primaryImageOfPage) webpage.primaryImageOfPage = primaryImageOfPage;
    }
    if (data.lang) {
        webpage.inLanguage = data.lang;
    }
    // Add fields from the nested 'webPage' object in schema.json
    if (data.webPage && !isEmpty(data.webPage)) {
        if (data.webPage.name) webpage.name = data.webPage.name;
        if (data.webPage.url) webpage.url = data.webPage.url;
        if (data.webPage.description) webpage.description = data.webPage.description;
        if (data.webPage.breadcrumb) webpage.breadcrumb = data.webPage.breadcrumb;
        if (data.webPage.mainEntityOfPage) webpage.mainEntityOfPage = data.webPage.mainEntityOfPage;
    }
    if (data.publisher && !isEmpty(data.publisher)) {
        const publisher = buildOrganization(data.publisher); // Assuming publisher is an Organization
        if (publisher) webpage.publisher = publisher;
    }
     if (data.copyrightHolder && !isEmpty(data.copyrightHolder)) {
         const copyrightHolder = buildOrganization(data.copyrightHolder); // Assuming copyrightHolder is an Organization
         if (copyrightHolder) webpage.copyrightHolder = copyrightHolder;
     }
    if (data.copyrightYear) webpage.copyrightYear = data.copyrightYear;
    if (data.datePublished) webpage.datePublished = data.datePublished;
    if (data.dateModified) webpage.dateModified = data.dateModified;

    return webpage;
}


export function makeHomepageLd(data: any) { // Use 'any' for full form data
  const result: any = {
    "@context": "https://schema.org",
    "@graph": []
  };

  // Build potential schema objects based on the input data
  const org = buildOrganization(data);
  const website = buildWebSite(data);
  const webpage = buildWebPage(data);

  // Add non-empty schema objects to the @graph after cleaning
  const cleanedOrg = buildSchemaObject(org);
  if (cleanedOrg) result["@graph"].push(cleanedOrg);

  const cleanedWebsite = buildSchemaObject(website);
  if (cleanedWebsite) result["@graph"].push(cleanedWebsite);

  const cleanedWebpage = buildSchemaObject(webpage);
  if (cleanedWebpage) result["@graph"].push(cleanedWebpage);

  return result;
}