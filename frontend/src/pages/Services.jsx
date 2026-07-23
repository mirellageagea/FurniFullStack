import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductAPI } from '../api/endpoints';
import ProductItem from '../components/ProductItem';
import TestimonialSection from '../components/TestimonialSection';

const FEATURES = [
  ['truck.svg', 'Fast & Free Shipping'], ['bag.svg', 'Easy to Shop'],
  ['support.svg', '24/7 Support'], ['return.svg', 'Hassle Free Returns'],
  ['truck.svg', 'Fast & Free Shipping'], ['bag.svg', 'Easy to Shop'],
  ['support.svg', '24/7 Support'], ['return.svg', 'Hassle Free Returns']
];

export default function Services() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    ProductAPI.featured().then((p) => setProducts(p.slice(0, 3))).catch(() => setProducts([]));
  }, []);

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Services</h1>
                <p className="mb-4">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
                <p>
                  <Link to="/shop" className="btn btn-secondary me-2">Shop Now</Link>
                  <a href="#" className="btn btn-white-outline">Explore</a>
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img-wrap"><img src="/images/couch.png" className="img-fluid" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="why-choose-section">
        <div className="container">
          <div className="row my-5">
            {FEATURES.map(([icon, title], i) => (
              <div className="col-6 col-md-6 col-lg-3 mb-4" key={i}>
                <div className="feature">
                  <div className="icon"><img src={`/images/${icon}`} alt="Image" className="imf-fluid" /></div>
                  <h3>{title}</h3>
                  <p>Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="product-section pt-0">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title">Crafted with excellent material.</h2>
              <p className="mb-4">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
              <p><Link to="/shop" className="btn">Explore</Link></p>
            </div>
            {products && products.map((p) => (
              <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0" key={p.id}>
                <ProductItem product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <TestimonialSection />
    </>
  );
}
