import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar, ArrowRight, Clock, User, Tag, BookOpen,
  Leaf, TrendingUp, Cpu, Globe, ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on precision agriculture, agritech innovation, market trends, and farmer success stories from East Africa.",
};

const featuredPost = {
  title: "How AI is Revolutionizing Crop Disease Detection in East Africa",
  excerpt: "Our deep learning models now detect 200+ crop diseases with 94% accuracy. Here's how we trained them using 5 million images from smallholder farms across Kenya, Uganda, and Tanzania.",
  author: "Dr. Neema Baraka",
  date: "Feb 18, 2026",
  readTime: "8 min read",
  category: "AI & Technology",
};

const posts = [
  { title: "The State of Smallholder Finance in 2026", excerpt: "A comprehensive analysis of agricultural lending trends, fintech innovation, and what it means for the 33 million smallholder farmers in East Africa.", author: "Fatima Hassan", date: "Feb 10, 2026", readTime: "6 min", category: "Finance" },
  { title: "Satellite Imagery for Precision Agriculture: A Beginner's Guide", excerpt: "How NDVI, multispectral imaging, and drone technology are helping farmers optimize irrigation, fertilizer use, and planting schedules.", author: "Kwame Asante", date: "Feb 3, 2026", readTime: "10 min", category: "Technology" },
  { title: "From 2 Acres to 20: Grace Akinyi's DIGI-FARMS Journey", excerpt: "How one farmer in Kisumu used AI diagnostics and marketplace access to transform her family farm into a thriving agricultural business.", author: "Janet Chebet", date: "Jan 28, 2026", readTime: "5 min", category: "Success Stories" },
  { title: "Building Resilient Supply Chains for African Agriculture", excerpt: "Lessons learned from connecting 500+ suppliers with 50,000+ farmers across three countries. What works, what doesn't, and what's next.", author: "Samuel Mwangi", date: "Jan 20, 2026", readTime: "7 min", category: "Operations" },
  { title: "Climate-Smart Agriculture: Adapting to Changing Weather Patterns", excerpt: "Hyperlocal weather modeling and its impact on planting decisions. How farmers are using DIGI-FARMS' climate tools to mitigate risk.", author: "Amara Osei", date: "Jan 12, 2026", readTime: "9 min", category: "Climate" },
  { title: "M-Pesa Integration: Making Agricultural Payments Seamless", excerpt: "How we built a frictionless payment experience for farmers buying inputs and receiving payouts — all through mobile money.", author: "Samuel Mwangi", date: "Jan 5, 2026", readTime: "6 min", category: "Product" },
];

const categories = [
  { name: "All Posts", icon: BookOpen },
  { name: "AI & Technology", icon: Cpu },
  { name: "Success Stories", icon: TrendingUp },
  { name: "Climate", icon: Leaf },
  { name: "Finance", icon: TrendingUp },
  { name: "Product", icon: Globe },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <Badge className="mb-6 bg-green-600/10 text-green-800 border-green-200 dark:bg-white/20 dark:text-white dark:border-white/30">Blog</Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Insights & <span className="text-green-600 dark:text-green-300">Stories</span>
          </h1>
          <p className="text-lg text-green-800 dark:text-green-100 max-w-2xl mx-auto">
            Agritech innovation, farmer success stories, market analysis, and lessons from the field.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
        <div className="container mx-auto px-4 max-w-7xl overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((c, i) => (
              <button
                key={c.name}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-950/50"}`}
              >
                <c.icon className="w-3.5 h-3.5" />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="overflow-hidden border-0 shadow-xl dark:bg-slate-800/50 hover:shadow-2xl transition-shadow">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-8 lg:p-12 flex items-center">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">{featuredPost.category}</Badge>
                    <h2 className="text-2xl lg:text-3xl font-black text-white mb-4 leading-tight">{featuredPost.title}</h2>
                    <p className="text-green-100 leading-relaxed">{featuredPost.excerpt}</p>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold">NB</div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{featuredPost.author}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{featuredPost.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-fit">
                    Read Article <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Post Grid */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.title} className="group hover:shadow-xl transition-shadow dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-400" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs"><Tag className="w-3 h-3 mr-1" />{post.category}</Badge>
                      <span className="text-xs text-slate-400">{post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors leading-snug">{post.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{post.author}</span>
                      </div>
                      <span className="text-xs text-slate-400">{post.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" size="lg">
              Load More Articles <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-800 dark:to-green-950">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">Stay Updated</h2>
          <p className="text-slate-600 dark:text-green-100 mb-8">Get weekly agritech insights, market reports, and farmer stories delivered to your inbox.</p>
          <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/register">Subscribe to Newsletter <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
