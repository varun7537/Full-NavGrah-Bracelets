import { fetchCustomProduct } from "../../lib/customBraceletApi";
import CustomBraceletJourney from "../../components/Customized/Custombraceletjourney";

export const revalidate = 60;

export default async function CustomBraceletPage() {
  const product = await fetchCustomProduct();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="text-center">
        <h1 className="text-2xl font-semibold text-[#241c16] sm:text-4xl">{product.name}</h1>
        {product.tagline && <p className="mt-2 text-sm text-[#6d6259] sm:text-lg">{product.tagline}</p>}
      </header>

      {product.imageUrl && (
        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-[#f5eee5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imageUrl} alt={product.imageAlt || product.name} className="h-full w-full object-cover" />
        </div>
      )}

      {product.description && (
        <p className="mt-6 text-[15px] leading-7 text-[#403a34] sm:text-base">{product.description}</p>
      )}

      {product.highlights.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-[#6d6259]">
          {product.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a47735]" />
              {h}
            </li>
          ))}
        </ul>
      )}

      <CustomBraceletJourney product={product} className="mt-10" />
    </main>
  );
}