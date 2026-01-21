export function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': 'https://postlytic-ten.vercel.app/#website',
                url: 'https://postlytic-ten.vercel.app',
                name: 'Postlytic',
                description: 'AI-Powered LinkedIn Post Analysis & Growth Tool',
                publisher: {
                    '@id': 'https://postlytic-ten.vercel.app/#organization',
                },
                inLanguage: 'en-US',
            },
            {
                '@type': 'Organization',
                '@id': 'https://postlytic-ten.vercel.app/#organization',
                name: 'Postlytic',
                url: 'https://postlytic-ten.vercel.app',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://postlytic-ten.vercel.app/logo.png',
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
