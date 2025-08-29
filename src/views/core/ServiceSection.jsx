import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import "./AvatarStyles.css";
import Slider from "react-slick";

function ServiceImageSlider() {
    const images = [
        "/services/dxhxfhfxj.jpg",
        "/services/xzhgxhhjc.jpg",
        "/services/zsgdhgxh.jpg"
    ];
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="service-image-slider" style={{
            width: "100%",
            height: "400px",
            overflow: "hidden",
            position: "relative",
            margin: 0,
            padding: 0,
            display: "block"
        }}>
            {images.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`service-slide-${index}`}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "opacity 1s ease-in-out",
                        opacity: index === currentIndex ? 1 : 0,
                        left: 0,
                        top: 0,
                        margin: 0,
                        padding: 0
                    }}
                />
            ))}
        </div>
    );
}

function ServiceSection() {
    return (
        <section className="custom-bg-green" style={{width: '100%', position: 'relative', direction: "rtl", textAlign: "right"}}>
            <div className="container-fluid mt-4">                        
                <div className="row custom-bg-green position-relative service-section-row">
                    <div className="custom-bg-green col-lg-6 align-items-center mt-7 mb-5 position-relative" style={{ zIndex: 2 }}>
                        <h2 className="mb-5 me-lg-6 me-5">خدمات ما</h2>
                        <p className="me-lg-6 me-5">
                            با تمامی خدمات شهرزنان کارآفرین آشنا شوید و از آنها بهره ببرید
                            <Link to={"/services/"} className="btn btn-outline-success me-1">
                                مشاهده خدمات
                            </Link>
                        </p>
                    </div> 

                    <div className="col-lg-6 position-relative" style={{ padding: 0, margin: 0 }}>
                        {/* Gradient Overlay */}
                        <div className="service-gradient-overlay"></div>
                        <div className="position-absolute" ></div>
                        <ServiceImageSlider />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ServiceSection;
