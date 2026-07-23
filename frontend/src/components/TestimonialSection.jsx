import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.",
    name: "Maria Jones",
    role: "CEO, Co-Founder, XYZ Inc.",
  },
  {
    quote:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.",
    name: "Maria Jones",
    role: "CEO, Co-Founder, XYZ Inc.",
  },
  {
    quote:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer convallis volutpat dui quis scelerisque.",
    name: "Maria Jones",
    role: "CEO, Co-Founder, XYZ Inc.",
  },
];

export default function TestimonialSection() {
  const sliderRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && window.tns && sliderRef.current) {
      window.tns({
        container: sliderRef.current,
        items: 1,
        axis: "horizontal",
        controlsContainer: "#testimonial-nav",
        swipeAngle: false,
        speed: 700,
        nav: true,
        controls: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        autoplayButtonOutput: false,
      });
      initialized.current = true;
    }
  }, []);

  return (
    <div className="testimonial-section before-footer-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 mx-auto text-center">
            <h2 className="section-title">Testimonials</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="testimonial-slider-wrap text-center">
              <div id="testimonial-nav">
                <span className="prev" data-controls="prev">
                  <span className="fa fa-chevron-left"></span>
                </span>
                <span className="next" data-controls="next">
                  <span className="fa fa-chevron-right"></span>
                </span>
              </div>
              <div className="testimonial-slider" ref={sliderRef}>
                {TESTIMONIALS.map((t, i) => (
                  <div className="item" key={i}>
                    <div className="row justify-content-center">
                      <div className="col-lg-8 mx-auto">
                        <div className="testimonial-block text-center">
                          <blockquote className="mb-5">
                            <p>&ldquo;{t.quote}&rdquo;</p>
                          </blockquote>
                          <div className="author-info">
                            <div className="author-pic">
                              <img
                                src="/images/person-1.png"
                                alt={t.name}
                                className="img-fluid"
                              />
                            </div>
                            <h3 className="font-weight-bold">{t.name}</h3>
                            <span className="position d-block mb-3">
                              {t.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
