import { Link } from 'react-router-dom';
import TestimonialSection from '../components/TestimonialSection';

const POSTS = [
  ['post-1.jpg', 'First Time Home Owner Ideas', 'Kristin Watson', 'Dec 19, 2021'],
  ['post-2.jpg', 'How To Keep Your Furniture Clean', 'Robert Fox', 'Dec 15, 2021'],
  ['post-3.jpg', 'Small Space Furniture Apartment Ideas', 'Kristin Watson', 'Dec 12, 2021']
];
const ALL_POSTS = [...POSTS, ...POSTS, ...POSTS].slice(0, 8);

export default function Blog() {
  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Blog</h1>
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

      <div className="blog-section">
        <div className="container">
          <div className="row">
            {ALL_POSTS.map(([img, title, author, date], i) => (
              <div className="col-12 col-sm-6 col-md-4 mb-5" key={i}>
                <div className="post-entry">
                  <a href="#" className="post-thumbnail"><img src={`/images/${img}`} alt="Image" className="img-fluid" /></a>
                  <div className="post-content-entry">
                    <h3><a href="#">{title}</a></h3>
                    <div className="meta">
                      <span>by <a href="#">{author}</a></span>
                      <span>on <a href="#">{date}</a></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TestimonialSection />
    </>
  );
}
