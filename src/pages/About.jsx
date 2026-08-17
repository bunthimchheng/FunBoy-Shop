export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-extrabold text-brand-900">About Game Discs Shop</h1>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Game Discs Shop is an online store dedicated to selling genuine, physical
        video game discs for PlayStation, Xbox, and Nintendo Switch. We started
        this project to give gamers an easy, affordable, and reliable way to buy
        both new and pre-owned game discs without worrying about authenticity.
      </p>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Every disc listed on our platform is inspected and graded before it goes
        on sale, so you always know exactly what condition you're buying. Our
        admin team manages inventory, pricing, and orders through a dedicated
        dashboard to keep the catalogue accurate and up to date.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl bg-brand-50 p-6 text-center">
          <p className="text-3xl font-extrabold text-brand-700">500+</p>
          <p className="text-sm text-gray-600">Titles in stock</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-6 text-center">
          <p className="text-3xl font-extrabold text-brand-700">3</p>
          <p className="text-sm text-gray-600">Platforms supported</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-6 text-center">
          <p className="text-3xl font-extrabold text-brand-700">1,200+</p>
          <p className="text-sm text-gray-600">Happy customers</p>
        </div>
      </div>
    </div>
  );
}
