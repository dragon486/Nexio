import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = "NEXIO | AI Lead Scoring & Autonomous Sales Automation",
    description = "NEXIO deploys autonomous AI agents that capture, score, and convert leads via WhatsApp and email 24/7. Replace your manual sales process with AI that never sleeps.",
    keywords = "AI Lead Scoring, AI Sales Automation, WhatsApp Automation AI, Lead Conversion Software, Autonomous CRM, AI Sales Workforce, Lead Qualification, Revenue Automation",
    ogImage = "/og-image.png",
    ogType = "website",
}) => {
    const siteTitle = title.includes("NEXIO") ? title : `${title} | NEXIO`;
    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://nexio.ai';

    const jsonLdString = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "NEXIO",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "NEXIO is the world's first autonomous AI sales workforce. It captures, scores, and converts leads via WhatsApp and email 24/7 with zero human latency.",
        "url": "https://nexio.ai",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "14-day free trial, no credit card required"
        },
        "featureList": [
            "AI Lead Qualification",
            "WhatsApp Automation",
            "Real-time Lead Scoring",
            "Revenue Analytics Dashboard",
            "Multi-channel Automation",
            "Human Handoff"
        ],
        "publisher": {
            "@type": "Organization",
            "name": "NEXIO",
            "url": "https://nexio.ai"
        }
    });

    return (
        <Helmet>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="NEXIO" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={canonicalUrl} />

            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content="NEXIO" />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={canonicalUrl} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            <meta name="theme-color" content="#3b82f6" />

            <script type="application/ld+json">{jsonLdString}</script>
        </Helmet>
    );
};

export default SEO;
