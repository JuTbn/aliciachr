import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  categoryLabel: string;
  priceCents: number;
  imageUrl: string;
  soldOut: boolean;
};

export default function ProductCard({
  slug,
  name,
  categoryLabel,
  priceCents,
  imageUrl,
  soldOut,
}: Props) {
  const price = (priceCents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });

  return (
    <Link href={`/catalogue/${slug}`} className="group block">
      {/* Visuel posé sur l'étagère grise */}
      <div className="relative flex h-80 items-end justify-center">
        <div className="absolute inset-x-0 bottom-0 h-14 bg-shelf" />
        <div className="relative mb-6 h-full w-56 bg-white shadow-md transition-transform group-hover:-translate-y-1">
          <Image
            src={imageUrl}
            alt={`${name}, ${categoryLabel.toLowerCase()}`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl">{name}</h2>
          <p className="italic">{categoryLabel}</p>
        </div>
        <p className="text-xl">{soldOut ? "Épuisé" : price}</p>
      </div>
    </Link>
  );
}