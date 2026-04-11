import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = "NEXIO | Architect your sales engine",
    description = "NEXIO deploys autonomous AI agents that qualify and close leads across your entire sales funnel with zero human latency.",
    keywords = "AI Sales, Autonomous Agents, WhatsApp CRM, Lead Scoring, Revenue Optimization",
    ogImage = "/og-image.png",
    ogType = "website",
    canonicalUrl = window.location.href
}) => {
    const siteTitle = title.includes("NEXIO") ? title : `${title} | NEXIO`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={canonicalUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            
            {/* Theme Color */}
            <meta name="theme-color" content="#3b82f6" />
        </Helmet>
    );
};

export default SEO;
