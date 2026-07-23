import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductAPI } from '../api/endpoints';
import ProductItem from '../components/ProductItem';
import { Spinner } from '../components/UI';

const CATEGORIES = ['Chair', 'Sofa', 'Table', 'Bed', 'Storage'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const [products, setProducts] = useState(null);

  useEffect(() => {
    setProducts(null);
    ProductAPI.list(currentCategory || undefined).then(setProducts).catch(() => setProducts([]));
  }, [currentCategory]);

  const setCategory = (cat) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Shop</h1>
                <p className="mb-4">Browse our collection of premium furniture.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="untree_co-section product-section before-footer-section">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <button className={`btn ${!currentCategory ? 'btn-dark' : 'btn-outline-dark'} me-2`} onClick={() => setCategory(null)}>All</button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`btn ${currentCategory === cat ? 'btn-dark' : 'btn-outline-dark'} me-2`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <br /><br /><br /><br />

          <div className="row">
            {!products && <Spinner label="Loading products…" />}
            {products && products.length === 0 && (
              <div className="col-12 text-center"><p>No products found in this category.</p></div>
            )}
            {products && products.map((p) => (
              <div className="col-12 col-md-4 col-lg-3 mb-5" key={p.id}>
                <ProductItem product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
