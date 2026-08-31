import { ProductCard } from "@/components/ui/ProductCard";
import { getProducts, getCategories } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; categoryId?: string }>;
}) {
    const { search, categoryId } = await searchParams;
    const [products, categories] = await Promise.all([
        getProducts(search, categoryId),
        getCategories(),
    ]);

    return (
        <div className="container home-container">
            {/* Hero Section — campaign block */}
            <section className="hero-section">
                <h1 className="hero-title">Bem-vindo à DevAI Store</h1>
                <p className="hero-subtitle">
                    Encontre os melhores produtos com a qualidade que você merece.
                </p>
                <div className="hero-actions">
                    <Link href="#vitrine" className="btn btn-on-image btn-default">
                        Explorar Produtos
                    </Link>
                </div>
            </section>

            {/* Categories Navigation — filter chips */}
            <section className="py-2">
                <div className="flex flex-row items-center gap-2 overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <Link
                        href="/"
                        className={`chip ${!categoryId ? "chip-active" : ""}`}
                    >
                        Todos
                    </Link>
                    {categories.map((cat) => {
                        const params = new URLSearchParams();
                        if (search) params.set("search", search);
                        params.set("categoryId", cat.id);
                        return (
                            <Link
                                key={cat.id}
                                href={`/?${params.toString()}`}
                                className={`chip ${categoryId === cat.id ? "chip-active" : ""}`}
                            >
                                {cat.name}
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Vitrine */}
            <section id="vitrine">
                <div className="section-header mb-4">
                    <h2 className="section-title">Destaques</h2>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-card text-muted">
                        Nenhum produto encontrado.
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
