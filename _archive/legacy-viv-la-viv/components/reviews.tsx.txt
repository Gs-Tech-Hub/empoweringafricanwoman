import { getPublishedReviews } from "@/lib/queries";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${index < rating ? "text-brand-secondary" : "text-brand-border"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function Reviews() {
  const reviews = await getPublishedReviews();

  if (reviews.length === 0) {
    return (
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-t border-brand-border py-24 text-center">
            <h2 className="font-heading text-2xl font-light uppercase tracking-widest text-brand-charcoal">
              Client reviews coming soon
            </h2>
          </div>
        </div>
      </section>
    );
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-brand-border py-24">
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <p className="section-subtitle pb-4">Client Reviews</p>
            <div className="mx-auto mb-6 h-px w-16 bg-gold" />
            <h2
              className="font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal md:text-4xl"
              data-aos="fade-up"
            >
              Loved by our clients
            </h2>
            <p
              className="mt-4 text-brand-muted"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              {averageRating.toFixed(1)} average rating from {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <article
                key={review.id}
                className="card-luxury p-6"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <StarRating rating={review.rating} />
                <p className="mt-4 text-sm leading-relaxed text-brand-text">
                  &ldquo;{review.content}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-brand-secondary">
                  {review.authorName}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
