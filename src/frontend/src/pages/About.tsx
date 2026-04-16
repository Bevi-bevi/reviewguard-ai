import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeCheck,
  Brain,
  ChevronRight,
  Clipboard,
  Cpu,
  Languages,
  MessageSquareOff,
  ScanText,
  Search,
  ShieldCheck,
  Smile,
} from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: Clipboard,
    step: "01",
    title: "Paste the Review",
    description:
      "Copy any product review from any marketplace — Amazon, eBay, Trustpilot, or elsewhere — and paste it into our analyzer.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description:
      "Our large language model scans the text across dozens of linguistic and semantic dimensions, cross-referencing known patterns of fake reviews in milliseconds.",
  },
  {
    icon: BadgeCheck,
    step: "03",
    title: "Get Your Verdict",
    description:
      "Receive a clear Genuine, Suspicious, or Fake verdict along with a confidence score and a breakdown of the exact signals that influenced the result.",
  },
];

const detectionFeatures = [
  {
    icon: Languages,
    title: "Linguistic Patterns",
    description:
      "Identifies unnatural sentence structures, over-formal phrasing, and repetitive word choices that are hallmarks of AI-generated or copy-pasted fake reviews.",
    tag: "NLP",
  },
  {
    icon: Smile,
    title: "Sentiment Inconsistencies",
    description:
      "Detects reviews where the stated rating conflicts with the emotional tone of the text — a common giveaway for incentivised or purchased reviews.",
    tag: "Sentiment",
  },
  {
    icon: MessageSquareOff,
    title: "Generic Language",
    description:
      "Flags overly vague content that lacks specific product details, a pattern that emerges when reviewers have never actually used the product.",
    tag: "Specificity",
  },
  {
    icon: ScanText,
    title: "Suspicious Phrasing",
    description:
      "Catches marketing buzzwords, brand-name over-insertion, and promotional language that authentic customers rarely use organically.",
    tag: "Keywords",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-card py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,oklch(0.6_0.16_190/0.12),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-4 border-primary/40 text-primary"
            >
              <Brain className="mr-1.5 h-3.5 w-3.5" />
              AI-Powered Authenticity
            </Badge>
          </motion.div>

          <motion.h1
            className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            About ReviewGuard AI
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ReviewGuard AI is an intelligent review-authenticity detector that
            uses large language models to distinguish genuine customer feedback
            from fake, incentivised, or AI-generated reviews — so you can shop
            smarter and trust the feedback you read.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/analyze">
              <Button
                size="lg"
                className="gap-2 transition-smooth"
                data-ocid="about.analyze_cta_button"
              >
                Try the Analyzer
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What is ReviewGuard AI */}
      <section className="bg-background py-20" data-ocid="about.what_section">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid gap-10 md:grid-cols-2 md:items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div>
              <div className="mb-3 flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-display text-sm font-semibold uppercase tracking-widest">
                  What is ReviewGuard AI
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Your AI shield against fake reviews
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Fake reviews cost consumers billions of dollars every year and
                erode trust in online marketplaces. Businesses pay for positive
                reviews, competitors pay for negative ones, and AI farms churn
                out thousands of inauthentic opinions at scale.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                ReviewGuard AI was built to level the playing field. By
                leveraging state-of-the-art natural language processing, we
                surface the hidden signals that reveal a review's true origin —
                giving shoppers the clarity they deserve before making a
                purchase decision.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "94%", label: "Detection accuracy" },
                { value: "<2s", label: "Average analysis time" },
                { value: "20+", label: "Linguistic signals checked" },
                { value: "Any", label: "Marketplace supported" },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  className="rounded-lg border border-border bg-card p-5 text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  data-ocid={`about.stat.item.${i + 1}`}
                >
                  <div className="font-display text-3xl font-bold text-primary">
                    {value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="border-y border-border bg-muted/30 py-20"
        data-ocid="about.how_section"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3 flex items-center justify-center gap-2 text-primary">
              <Search className="h-5 w-5" />
              <span className="font-display text-sm font-semibold uppercase tracking-widest">
                How It Works
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Three steps to a verdict
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              The entire analysis pipeline runs in seconds — from raw text to a
              fully explained result.
            </p>
          </motion.div>

          <div className="relative grid gap-6 md:grid-cols-3">
            {/* Connector line (desktop only) */}
            <div className="pointer-events-none absolute left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] top-8 hidden h-px bg-border md:block" />

            {steps.map(({ icon: Icon, step, title, description }, i) => (
              <motion.div
                key={step}
                className="relative flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                data-ocid={`about.step.item.${i + 1}`}
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-card shadow-sm">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div className="mt-2 font-mono text-xs font-semibold tracking-widest text-muted-foreground">
                  STEP {step}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Detect */}
      <section className="bg-background py-20" data-ocid="about.detect_section">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3 flex items-center justify-center gap-2 text-primary">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-display text-sm font-semibold uppercase tracking-widest">
                What We Detect
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              The signals that expose fake reviews
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Our model is trained to recognise the subtle — and not so subtle —
              patterns that betray inauthentic content.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {detectionFeatures.map(
              ({ icon: Icon, title, description, tag }, i) => (
                <motion.div
                  key={title}
                  className="group rounded-xl border border-border bg-card p-6 transition-smooth hover:border-primary/40 hover:shadow-sm"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  data-ocid={`about.detect.item.${i + 1}`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border text-xs text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-border bg-muted/30 py-20">
        <motion.div
          className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Ready to verify a review?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Paste any review and get an AI-powered authenticity verdict in
            seconds. Sign in to save your results and build a history of
            analyses.
          </p>
          <div className="mt-8">
            <Link to="/analyze">
              <Button
                size="lg"
                className="gap-2 transition-smooth"
                data-ocid="about.cta_button"
              >
                Analyze a Review Now
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
