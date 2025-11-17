export default function About() {
  return (
    <section className="min-h-screen pt-28 pb-16 px-6 text-gray-900 dark:text-gray-100 bg-gradient-aurora bg-aurora-overlay">
      <div className="max-w-4xl mx-auto space-y-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-purple-900/40">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
            Our mission
          </p>
          <h1 className="text-3xl font-bold">About Local Reviews</h1>
        </header>

        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
          Local Reviews started as a passion project to highlight the indie
          coffee shops, fitness studios, barber shops, and service providers
          that make every neighborhood feel like home. We believe authentic
          stories from real people help communities thrive, so we built a space
          where sharing feedback is effortless and fun.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-purple-900/40">
            <h2 className="text-xl font-semibold mb-2">For locals</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Discover trusted businesses nearby, support owners who care, and
              help your neighbors avoid guessing games with honest reviews.
            </p>
          </article>
          <article className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-purple-900/40">
            <h2 className="text-xl font-semibold mb-2">For owners</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Showcase your story, gather feedback, and build loyal fans. Listing
              a business is free—perfect for side hustles and seasoned pros.
            </p>
          </article>
        </div>

        <footer className="space-y-3">
          <h2 className="text-2xl font-semibold">What&apos;s next?</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We&apos;re rolling out richer profiles, messaging tools, and curated
            city guides soon. Have ideas? Reach out at{" "}
            <a
              href="mailto:hello@localreviews.app"
              className="text-indigo-600 dark:text-indigo-300 underline-offset-4 hover:underline"
            >
              hello@localreviews.app
            </a>
            .
          </p>
        </footer>
      </div>
    </section>
  );
}

