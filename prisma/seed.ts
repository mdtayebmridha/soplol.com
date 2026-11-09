import {
  PrismaClient,
  ProductCategory as DatabaseProductCategory,
  ProductSubcategory as DatabaseProductSubcategory,
} from '@prisma/client';
import { INITIAL_PRODUCTS } from '../src/lib/data';

const prisma = new PrismaClient();

function toEnum(value: string) {
  return value.toUpperCase();
}

async function main() {
  for (const product of INITIAL_PRODUCTS) {
    const variants = (product.variants ?? []).map((variant) => ({
      name: variant.name,
      options: variant.options,
      sku: `${product.id}-${variant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      stock: product.stockQuantity,
    }));

    const data = {
      title: product.title,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      category: toEnum(product.category) as DatabaseProductCategory,
      subcategory: toEnum(product.subcategory) as DatabaseProductSubcategory,
      priceBDT: product.priceBDT,
      priceUSD: product.priceUSD,
      compareAtPriceBDT: product.compareAtPriceBDT ?? null,
      compareAtPriceUSD: product.compareAtPriceUSD ?? null,
      images: product.images,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      rating: product.rating,
      reviewCount: product.reviewCount,
      isFeatured: product.isFeatured ?? false,
      isBestseller: product.isTrending ?? false,
      isNewArrival: product.isNewArrival ?? false,
      isTrending: product.isTrending ?? false,
      tags: product.tags,
      vendorId: product.vendorId,
      vendorName: product.vendorName ?? 'soplol Official',
    };

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: { ...data, id: product.id, variants: { create: variants } },
      update: { ...data, variants: { deleteMany: {}, create: variants } },
    });
  }
}

main()
  .catch((error) => {
    console.error('Failed to seed products:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
