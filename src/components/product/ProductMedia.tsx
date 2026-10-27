import { getTranslations } from "next-intl/server";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Card } from "@/components/ui/Card";
import type { Product } from "@/data/catalog";
import { getProductImages } from "@/data/product-images";
import { discountPercent } from "@/lib/format";

export async function ProductMedia({ product }: { product: Product }) {
  const productT = await getTranslations("product");
  const nav = await getTranslations("nav");
  const galleryT = await getTranslations("gallery");
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const images = getProductImages(product);

  return (
    <Card className="relative overflow-hidden border-line-strong/70 p-0">
      <ProductGallery
        images={images}
        brand={product.brand}
        categoryLabel={nav(`categories.${product.category}`)}
        isNew={Boolean(product.isNew)}
        discount={discount}
        labels={{
          newLabel: productT("new"),
          previous: galleryT("previous"),
          next: galleryT("next"),
          zoom: galleryT("zoom"),
          close: galleryT("close"),
          photoNote: galleryT("photoNote"),
          thumbnail: galleryT("thumbnail"),
          mainImage: galleryT("mainImage"),
          gallery: galleryT("label", { name: product.name }),
        }}
      />
    </Card>
  );
}
