import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "5 Daily Habits That Improve Your Long-Term Health",
    excerpt: "Small, consistent actions compound over time. Here are five science-backed habits that make a real difference.",
    date: "May 20, 2025",
    readTime: "4 min read",
    category: "Wellness",
  },
  {
    title: "Understanding Your Symptom Data: What the Numbers Mean",
    excerpt: "Your health metrics tell a story. We break down how to interpret common patterns in your symptom logs.",
    date: "May 12, 2025",
    readTime: "6 min read",
    category: "Health Tips",
  },
  {
    title: "How Brain Games Improve Cognitive Function",
    excerpt: "Research suggests targeted cognitive exercises can improve memory and focus. Here's what the science says.",
    date: "April 30, 2025",
    readTime: "5 min read",
    category: "Brain Health",
  },
  {
    title: "When to See a Doctor vs. Monitor Symptoms at Home",
    excerpt: "Not every symptom requires an emergency visit. Learn how to make that call confidently.",
    date: "April 18, 2025",
    readTime: "7 min read",
    category: "Guidance",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Symptom Scribe Blog</h1>
          <p className="text-muted-foreground text-lg">
            Health insights, platform updates, and wellness tips — written for real people.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        {posts.map((post) => (
          <article key={post.title} className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{post.category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {post.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {post.readTime}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
            <button className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              Read more <ArrowRight className="h-3 w-3" />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Blog;
