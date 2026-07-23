import { Link } from 'react-router-dom';
import TestimonialSection from '../components/TestimonialSection';

const TEAM = [
  ['person_1.jpg', 'Lawson', 'Arnold'],
  ['person_2.jpg', 'Jeremy', 'Walker'],
  ['person_3.jpg', 'Patrik', 'White'],
  ['person_4.jpg', 'Kathryn', 'Ryan']
];

export default function About() {
  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>About Us</h1>
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
          <div className="row justify-content-between align-items-center">
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
              <div className="img-wrap"><img src="/images/why-choose-us-img.jpg" alt="Image" className="img-fluid" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="untree_co-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-5 mx-auto text-center"><h2 className="section-title">Our Team</h2></div>
          </div>
          <div className="row">
            {TEAM.map(([img, first, last]) => (
              <div className="col-12 col-md-6 col-lg-3 mb-5 mb-md-0" key={first}>
                <img src={`/images/${img}`} className="img-fluid mb-5" />
                <h3><a href="#"><span>{first}</span> {last}</a></h3>
                <span className="d-block position mb-4">CEO, Founder, Atty.</span>
                <p>Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                <p className="mb-0"><a href="#" className="more dark">Learn More</a></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TestimonialSection />
    </>
  );
}
