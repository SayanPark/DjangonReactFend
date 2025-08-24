import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { getCategoryImage } from "../../utils/categoryImageMapper";

const arrowStyleOverrides = `
  .slick-arrow.slick-next::before,
  .slick-arrow.slick-prev::before {
    display: none !important;
  }
`;
function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <>
            <style>{arrowStyleOverrides}</style>
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    right: 0,
                    zIndex: 1,
                    width: "60px",
                    height: "120px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderTopLeftRadius: "60px",
                    borderBottomLeftRadius: "60px",
                    cursor: "pointer",
                    color: "rgba(50, 142, 110, 0.4)",
                    fontSize: "80px",
                    fontWeight: "bold",
                    userSelect: "none",
                }}
                onClick={onClick}
            >
                <span style={{ display: "inline-block", transform: "translateY(-5px)" }}>{'>'}</span>
            </div>
        </>
    )
}
function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <>
            <style>{arrowStyleOverrides}</style>
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    left: 0,
                    zIndex: 1,
                    width: "60px",
                    height: "120px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderTopRightRadius: "60px",
                    borderBottomRightRadius: "60px",
                    cursor: "pointer",
                    color: "rgba(50, 142, 110, 0.4)",
                    fontSize: "80px",
                    fontWeight: "bold",
                    userSelect: "none",
                }}
                onClick={onClick}
            >
                <span style={{ display: "inline-block", transform: "translateY(-5px)" }}>{'<'}</span>
            </div>
        </>
    );
}

function LazyBackgroundImage({ src, style, className, children }) {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef();

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "100px",
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.disconnect();
        };
    }, []);

    const combinedStyle = {
        ...style,
        backgroundImage: isVisible ? `linear-gradient(to top, rgba(0,0,0,60%), rgba(0,0,0,0.1)), url(${src})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    return (
        <div ref={ref} className={className} style={combinedStyle}>
            {children}
        </div>
    );
}

function CategorySlider({ category }) {
    const [sliderSettings, setSliderSettings] = React.useState({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {breakpoint: 992, settings: {slidesToShow: 3}},
            {breakpoint: 768, settings: {slidesToShow: 2}},
            {breakpoint: 576, settings: {slidesToShow: 1}}
        ]
    });

    return (
        <section className="pt-5 pb-5 mt-3">
            <div className="container2">
                <div className="row g-0">
                    <div className="col-12">
                        <div className="mb-4 me-3">
                            <h2>دسته بندی مطالب</h2>
                        </div>
                        <Slider {...sliderSettings}>
                        {category?.filter(c => c.title !== "اخبار").map((c) => {
                            // Check if category slug matches any image filename in public/categories
                            const categoryImage = getCategoryImage(c.slug) || c.image;
                            
                            return (
                                <Link to={`/category/${c.slug}`} key={c.id}>
                                    <div className="px-2">
                                        <div className="card bg-transparent">
                                            <div className="d-flex flex-column align-items-center">
                                                <LazyBackgroundImage
                                                    src={categoryImage}
                                                    style={{
                                                        width: "100%",
                                                        height: 120,
                                                        position: "relative",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            bottom: 0,
                                                            width: "100%",
                                                            paddingTop: 8,
                                                            paddingBottom: 8,
                                                            color: "white",
                                                            textShadow: "0 0 5px rgba(0,0,0,0.7)",
                                                        }}
                                                    >
                                                        <h6 className="me-2">{c.title}</h6>
                                                        <small className="me-2">{c.post_count || "0"} مقاله</small>
                                                    </div>
                                                </LazyBackgroundImage>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        </Slider>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategorySlider;
