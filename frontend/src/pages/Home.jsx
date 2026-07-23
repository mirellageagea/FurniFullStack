import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductAPI } from '../api/endpoints';
import ProductItem from '../components/ProductItem';
import TestimonialSection from '../components/TestimonialSection';
import { imageUrl } from '../api/client';

export default function Home() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    ProductAPI.featured().then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Modern Interior <span className="d-block">Design Studio</span></h1>
                <p className="mb-4">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
                <p>
                  <Link to="/shop" className="btn btn-secondary me-2">Shop Now</Link>
                  <a href="#" className="btn btn-white-outline">Explore</a>
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img-wrap">
                <img src="/images/couch.png" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title">Crafted with excellent material.</h2>
              <p className="mb-4">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
              <p><Link to="/shop" className="btn">Explore</Link></p>
            </div>

            {products && products.length > 0 ? (
              products.map((p) => (
                <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0" key={p.id}>
                  <ProductItem product={p} />
                </div>
              ))
            ) : (
              <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                <Link className="product-item" to="/shop">
                  <img src="/images/product-1.png" className="img-fluid product-thumbnail" />
                  <h3 className="product-title">Nordic Chair</h3>
                  <strong className="product-price">$50.00</strong>
                  <span className="icon-cross"><img src="/images/cross.svg" className="img-fluid" /></span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="why-choose-section">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-6">
              <h2 className="section-title">Why Choose Us</h2>
              <p>Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
              <div className="row my-5">
                {[
                  ['truck.svg', 'Fast & Free Shipping'],
                  ['bag.svg', 'Easy to Shop'],
                  ['support.svg', '24/7 Support'],
                  ['return.svg', 'Hassle Free Returns']
                ].map(([icon, title]) => (
                  <div className="col-6 col-md-6" key={title}>
                    <div className="feature">
                      <div className="icon"><img src={`/images/${icon}`} alt="Image" className="imf-fluid" /></div>
                      <h3>{title}</h3>
                      <p>Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="img-wrap">
                <img src="/images/why-choose-us-img.jpg" alt="Image" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="we-help-section">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-7 mb-5 mb-lg-0">
              <div className="imgs-grid">
                <div className="grid grid-1"><img src="/images/img-grid-1.jpg" alt="Untree.co" /></div>
                <div className="grid grid-2"><img src="/images/img-grid-2.jpg" alt="Untree.co" /></div>
                <div className="grid grid-3"><img src="/images/img-grid-3.jpg" alt="Untree.co" /></div>
              </div>
            </div>
            <div className="col-lg-5 ps-lg-5">
              <h2 className="section-title mb-4">We Help You Make Modern Interior Design</h2>
              <p>Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
              <ul className="list-unstyled custom-list my-4">
                <li>Donec vitae odio quis nisl dapibus malesuada</li>
                <li>Donec vitae odio quis nisl dapibus malesuada</li>
                <li>Donec vitae odio quis nisl dapibus malesuada</li>
                <li>Donec vitae odio quis nisl dapibus malesuada</li>
              </ul>
              <p><a href="#" className="btn">Explore</a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="popular-product">
        <div className="container">
          <div className="row">
            {products && products.length > 0 ? (
              products.map((p) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0" key={p.id}>
                  <div className="product-item-sm d-flex">
                    <div className="thumbnail">
                      {p.imageUrl ? (
                        <img src={imageUrl(p.imageUrl)} alt="Image" className="img-fluid" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                      ) : (
                        <img src="/images/product-1.png" alt="Image" className="img-fluid" />
                      )}
                    </div>
                    <div className="pt-3">
                      <h3>{p.name}</h3>
                      <p>{p.description}</p>
                      <p><Link to="/shop">Read More</Link></p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
                <div className="product-item-sm d-flex">
                  <div className="thumbnail"><img src="/images/product-1.png" alt="Image" className="img-fluid" /></div>
                  <div className="pt-3">
                    <h3>Nordic Chair</h3>
                    <p>Donec facilisis quam ut purus rutrum lobortis.</p>
                    <p><a href="#">Read More</a></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TestimonialSection />

      <div className="blog-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-6"><h2 className="section-title">Recent Blog</h2></div>
            <div className="col-md-6 text-start text-md-end"><Link to="/blog" className="more">View All Posts</Link></div>
          </div>
          <div className="row">
            {[
              ['post-1.jpg', 'First Time Home Owner Ideas', 'Kristin Watson', 'Dec 19, 2021'],
              ['post-2.jpg', 'How To Keep Your Furniture Clean', 'Robert Fox', 'Dec 15, 2021'],
              ['post-3.jpg', 'Small Space Furniture Apartment Ideas', 'Kristin Watson', 'Dec 12, 2021']
            ].map(([img, title, author, date]) => (
              <div className="col-12 col-sm-6 col-md-4 mb-4 mb-md-0" key={title}>
                <div className="post-entry">
                  <a href="#" className="post-thumbnail"><img src={`/images/${img}`} alt="Image" className="img-fluid" /></a>
                  <div className="post-content-entry">
                    <h3><a href="#">{title}</a></h3>
                    <div className="meta">
                      <span>by <a href="#">{author}</a></span> <span>on <a href="#">{date}</a></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
