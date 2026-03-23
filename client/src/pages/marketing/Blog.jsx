import React from 'react';
import PageTemplate from '../../components/marketing/PageTemplate';

const BlogPage = () => {
    const posts = [
        {
            title: "The Architecture of AI Sales",
            date: "Mar 18, 2026",
            category: "Product"
        },
        {
            title: "Qualifying Leads Without Friction",
            date: "Mar 12, 2026",
            category: "Strategy"
        },
        {
            title: "Measuring ROI in AI Automation",
            date: "Mar 5, 2026",
            category: "Analytics"
        }
    ];

    return (
        <PageTemplate 
            title="Insights for architects." 
            subtitle="The latest updates, strategies, and deep dives from the NEXIO engineering and product teams."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                    <div key={i} className="group cursor-pointer hover:bg-muted/5 transition-colors p-6 rounded-2xl border border-border/10">
                        <div className="text-[10px] uppercase font-bold text-primary tracking-widest mb-4">{post.category}</div>
                        <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h3>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                            Discover how our latest architectural improvements are helping companies scale their sales engines without adding headcount.
                        </p>
                        <div className="text-xs text-muted-foreground font-medium">{post.date}</div>
                    </div>
                ))}
            </div>
        </PageTemplate>
    );
};

export default BlogPage;
