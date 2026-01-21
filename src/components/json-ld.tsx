export function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': 'https://postlytic.com/#website',
                url: 'https://postlytic.com',
                name: 'Postlytic',
                description: 'AI-Powered LinkedIn Post Analysis & Growth Tool',
                publisher: {
                    '@id': 'https://postlytic.com/#organization',
                },
                inLanguage: 'en-US',
            },
            {
                '@type': 'Organization',
                '@id': 'https://postlytic.com/#organization',
                name: 'Postlytic',
                url: 'https://postlytic.com',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://postlytic.com/logo.png',
                    width: 512,
                    height: 512,
                },
                sameAs: [
                    'https://twitter.com/postlytic',
                    'https://linkedin.com/company/postlytic',
                ],
            },
            {
                '@type': 'SoftwareApplication',
                name: 'Postlytic',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '1250',
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
