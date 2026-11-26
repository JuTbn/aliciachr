import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = {
  cartes: { value: "CARTE", filter: "Cartes", label: "Carte" },
  "illustrations-couleurs": {
    value: "ILLUSTRATION_COULEUR",
    filter: "Illustrations couleurs",
    label: "Illustration couleur",
  },
  "illustrations-noir-et-blanc": {
    value: "ILLUSTRATION_NB",
    filter: "Illustrations noir et blanc",
    label: "Illustration noir & blanc",
  },
  "livre-de-coloriage": {
    value: "LIVRE_COLORIAGE",
    filter: "Livre de coloriage",
    label: "Livre de coloriage",
  },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

const LABEL_BY_VALUE = Object.fromEntries(
  Object.values(CATEGORIES).map((c) => [c.value, c.label])
);

// La page elle-même ne lit rien de dynamique : elle peut être préparée à l'avance
export default function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-5xl font-semibold">Mes créations</h1>
      <p className="mt-6 max-w-3xl text-2xl">
        Vous pouvez retrouver tous mes dessins en vente ici ! Ces dessins sont
        des séries limitées. Une fois la série complètement vendue, elle ne sera
        plus réimprimée.
      </p>

      <Suspense fallback={<p className="mt-16 text-xl">Chargement…</p>}>
        <CatalogueContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

// Ici : lecture de l'URL + appel à Prisma, donc contenu dynamique
async function CatalogueContent({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  const activeKey =
    categorie && Object.hasOwn(CATEGORIES, categorie)
      ? (categorie as CategoryKey)
      : undefined;

  const products = await prisma.product.findMany({
    where: activeKey ? { category: CATEGORIES[activeKey].value } : undefined,
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <nav aria-label="Catégories" className="mt-16">
        <p className="mb-3 text-sm">Catégorie</p>
        <ul className="flex flex-wrap gap-2">
          <FilterLink href="/catalogue" active={!activeKey}>
            Toutes
          </FilterLink>
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
            <FilterLink
              key={key}
              href={`/catalogue?categorie=${key}`}
              active={activeKey === key}
            >
              {CATEGORIES[key].filter}
            </FilterLink>
          ))}
        </ul>
      </nav>

      <div className="mt-16 grid gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            slug={p.slug}
            name={p.name}
            categoryLabel={LABEL_BY_VALUE[p.category]}
            priceCents={p.priceCents}
            imageUrl={p.imageUrl}
            soldOut={p.isLimited && p.stock === 0}
          />
        ))}
      </div>
    </>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block border px-4 py-2 text-lg ${
          active
            ? "border-stone bg-stone text-white"
            : "border-shelf text-stone hover:border-stone"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}