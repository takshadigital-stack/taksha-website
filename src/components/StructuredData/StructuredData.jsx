/**
 * StructuredData — JSON-LD Schema.org renderer
 */
import { Helmet } from 'react-helmet-async';

export default function StructuredData({ schema }) {
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Taksha',
    legalName: 'TAKSHA',
    url: 'https://taksha.studio',
    logo: 'https://taksha.studio/taksha-nexus-logo.png',
    description: 'Taksha is a digital craft studio blending branding, design, engineering, and AI.',
    sameAs: [
      'https://www.linkedin.com/company/taksha',
      'https://www.instagram.com/taksha.studio',
    ],
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'Udyam Registration Number',
      value: 'UDYAM-OD-19-0177339',
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://taksha.studio${item.path}`,
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Taksha',
    image: 'https://taksha.studio/taksha-nexus-logo.png',
    url: 'https://taksha.studio',
    priceRange: '$$$$',
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
  };
}

export function serviceSchema(serviceName, description, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    provider: { '@type': 'Organization', name: 'Taksha' },
    description,
    url: `https://taksha.studio${path}`,
  };
}

export function creativeWorkSchema(projectName, description, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projectName,
    creator: { '@type': 'Organization', name: 'Taksha' },
    description,
    url: `https://taksha.studio${path}`,
  };
}