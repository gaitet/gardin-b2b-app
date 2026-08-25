import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Page } from '@/components/Page';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';

import { colors } from '@/theme/colors';
import { getMaterials } from '@/api/materials';

type Material = {
  id: number;
  article: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
};

export const CatalogPage: FC = () => {
  const [products, setProducts] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Усі');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getMaterials();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);
  const categories = useMemo(() => {
  const list = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  return ['Усі', ...list];
}, [products]);

const filteredProducts = useMemo(() => {
  const value = search.toLowerCase().trim();

  return products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Усі' ||
      product.category === selectedCategory;

    const matchesSearch =
      !value ||
      product.article.toLowerCase().includes(value) ||
      product.name.toLowerCase().includes(value);

    return matchesCategory && matchesSearch;
  });
}, [products, search, selectedCategory]);

  return (
    <Page back>
      <div
        style={{
          minHeight: '100vh',
          background: colors.background,
          padding: 20,
          paddingBottom: 90,
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: 16,
            color: colors.text,
          }}
        >
          Каталог
        </h1>

        <input
          type="text"
          placeholder="Пошук за артикулом або назвою..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            marginBottom: 20,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            fontSize: 15,
            boxSizing: 'border-box',
          }}
        />
        <div
  style={{
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    marginBottom: 20,
    paddingBottom: 6,
  }}
>
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      style={{
        whiteSpace: 'nowrap',
        padding: '8px 14px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        background:
          selectedCategory === category
            ? colors.primary
            : colors.white,
        color:
          selectedCategory === category
            ? '#fff'
            : colors.text,
      }}
    >
      {category}
    </button>
  ))}
</div>

        {loading ? (
          <p>Завантаження...</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              article={product.article}
              name={product.name}
              price={product.price}
              unit={product.unit}
            />
          ))
        )}

        <BottomNavigation />
      </div>
    </Page>
  );
};