import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductDetail } from "../../../lib/productApi";
import ProductDetailsContainer from "../../../components/Products/ProductDetailsContainer";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const detail = await fetchProductDetail(slug);

  if (!detail) {
    return {
      title: "Product not found",
    };
  }

  const imageUrl =
    typeof detail.product.imageUrl === "string" &&
    detail.product.imageUrl.trim().length > 0
      ? detail.product.imageUrl.trim()
      : undefined;

  return {
    title: detail.product.name,
    description:
      detail.tagline ||
      detail.product.description,
    openGraph: {
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BraceletDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const detail = await fetchProductDetail(slug);

  if (!detail) {
    notFound();
  }

  return (
    <ProductDetailsContainer
      detail={detail}
    />
  );
}
