import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { categoryIcons } from "@/config/category-icons";
import { categories } from "@/config/nav";
import { getProductsByCategory } from "@/data/catalog";
import { Link } from "@/i18n/navigation";

export async function CategoryGrid() {
  const nav = await getTranslations("nav");
  const home = await getTranslations("home.categories");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => {
        const Icon = categoryIcons[category.key];
        const count = getProductsByCategory(category.key).length;

        return (
          <Link
            key={category.key}
            href={`/tienda/${category.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface/60 p-5 backdrop-blur-sm transition-colors duration-base hover:border-line-strong"
          >
            <div className="flex items-start justify-between">
              <span className="flex size-10 items-center justify-center rounded-md border border-line bg-surface-2/70 text-accent transition-colors duration-base group-hover:border-accent/40">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-faint transition-colors duration-base group-hover:text-accent"
              />
            </div>

            <div className="mt-auto pt-8">
              <p className="font-display text-sm leading-tight">
                {nav(`categories.${category.key}`)}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                {home("count", { count })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
