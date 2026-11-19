import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

export const metadata = {
  title: "Supply Chain & Operations Strategy | Quant Fusion Blog",
  description: "Executive research on eliminating spreadsheet firefighting, solving combinatorial explosion in order routing, and protecting profit margins.",
};

export default function BlogPage() {
  const posts = [
    {
      title: "You Can’t Cut What You Can’t See: The 150 Basis Point Loss CFOs Miss",
      date: "September 10, 2025",
      readTime: "4 min read",
      category: "CFO Strategy",
      image: "/assets/blog_cfo_margin_strategy.jpg",
      imageAlt: "Executive boardroom CFO margin strategy session",
      excerpt:
        "At a $60M industrial distributor, customer service and sales spent 12,000 hours annually answering one question: 'When will my order ship?' Here is the mathematical breakdown of how spreadsheet firefighting silently drains 1.5% of net profit margin.",
    },
    {
      title: "Revolutionizing Supply Chains: How Quant Fusion Crushes the Combinatorial Explosion Problem",
      date: "August 14, 2025",
      readTime: "6 min read",
      category: "Data Science & AI",
      image: "/assets/product_order_console_cockpit.jpg",
      imageAlt: "Quant Fusion combinatorial exception engine and 1-click order cockpit",
      excerpt:
        "When hundreds of components, multi-tier suppliers, carrier delays, and plant schedules intersect, the number of routing permutations exceeds human Excel capabilities. Here is how deterministic rules and algorithmic exception engines resolve order complexity in under 250 milliseconds.",
    },
    {
      title: "Are You Sabotaging Your Sales Team? The True Ratio of Selling vs. Firefighting",
      date: "September 2, 2025",
      readTime: "3 min read",
      category: "Operations",
      image: "/assets/dept_inside_sales_command.jpg",
      imageAlt: "Inside sales and customer operations command center",
      excerpt:
        "Top-performing sales engineers spend up to 8 hours a week tracking down delayed customer orders instead of building new pipeline. Why customer service friction is secretly your largest revenue bottleneck.",
    },
    {
      title: "Amazon’s Ship Date Transparency Exposes B2B Communication Gaps",
      date: "July 24, 2024",
      readTime: "5 min read",
      category: "Customer Experience",
      image: "/assets/facility_chicago_intermodal_rail.jpg",
      imageAlt: "Modern intermodal container logistics and precision delivery telematics",
      excerpt:
        "Commercial buyers who experience sub-second delivery tracking on consumer platforms now demand the same precision from $100K industrial equipment orders. Why 'sometime next week' is no longer an acceptable B2B answer.",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="font-mono text-[12px] uppercase tracking-wider text-ink-muted block">
            Executive Research & Strategy
          </span>
          <h1 className="font-serif text-[40px] sm:text-[48px] font-semibold text-ink-primary mt-2 tracking-tight">
            Supply Chain Operations Briefings
          </h1>
          <p className="font-sans text-[17px] text-ink-secondary mt-3 max-w-xl">
            Empirical analyses, mathematical models, and operational frameworks from Deb Friar and the Quant Fusion engineering team.
          </p>
        </div>
      </section>

      {/* Article Feed */}
      <section className="py-16 md:py-24 border-b border-border-rule">
        <div className="max-w-[960px] mx-auto px-6 space-y-10">
          {posts.map((post, i) => (
            <article
              key={i}
              className="bg-surface-sheet rounded p-6 sm:p-8 border border-border-rule shadow-card space-y-5 hover:border-btn-cta/40 transition-colors card-hover-lift"
            >
              <div className="relative w-full h-[200px] sm:h-[260px] rounded overflow-hidden border border-border-rule/80 img-zoom-container">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between text-[12px] font-mono text-ink-muted">
                <span className="font-semibold text-btn-cta uppercase tracking-wider">
                  {post.category}
                </span>
                <div className="flex items-center gap-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>
              </div>

              <h2 className="font-serif text-[24px] sm:text-[28px] font-semibold text-ink-primary leading-tight">
                {post.title}
              </h2>

              <p className="font-sans text-[15px] text-ink-secondary leading-relaxed">
                {post.excerpt}
              </p>

              <div className="pt-2 border-t border-border-rule/60 flex items-center justify-between">
                <span className="font-mono text-[12px] text-ink-muted">Author: Deb Friar, CEO</span>
                <span className="inline-flex items-center text-[14px] font-medium text-link-interactive hover:underline">
                  Read Full Briefing
                  <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
