import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Momment from "../../plugin/Moment";
import CategorySlider from "./CategorySlider";
import useUserData from "../../plugin/useUserData";
import Slider from "react-slick";
import "../../index.css";
import "./AvatarStyles.css";
import ServiceSection from "./ServiceSection"; // Importing ServiceSection

function ImageSlider() {
    const images = [
        "/A1.webp",
        "/Four_Iranian_women_wearing_outfits_representing_medicine,_engineering.webp",
        "/Iranian_rural_women_with_traditional_rural_Iranian_clothing_standingg.webp",
        "/Iranian_rural_women_with_traditional_rural_Iranian_clothing_standing.webp",
        "/fxhcgjcg.webp"
    ];
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div style={{
            position: "absolute",
            top: "1%", // Adjust to fit inside phone screen
            left: "33%", // Adjust left to center with reduced width
            width: "35%", // Further reduced width as requested
            height: "93%", // Increased height as requested
            overflow: "hidden",
            borderRadius: "30px",
            zIndex: "2"
        }}>
            {images.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`slide-${index}`}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "opacity 1s ease-in-out",
                        opacity: index === currentIndex ? 1 : 0,
                    }}
                />
            ))}
        </div>
    );
}

function Index({ logoutMessage }) {
    const [message, setMessage] = useState(null);
    const [posts, setPosts] = useState([])
    const [category, setCategory] = useState([])
    const [authenticatedUserCount, setAuthenticatedUserCount] = useState(0)
    const [usersData, setUsersData] = useState([])
    const [, setLoading] = useState(true)
    
    const itemsPerPage = 4
    const [currentPage, setCurrentPage] = useState(1)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const newsPosts = posts.filter(post => post.category && post.category.title === "اخبار")
    const otherPosts = posts.filter(post => !(post.category && post.category.title === "اخبار"))
    const paginatedOtherPosts = otherPosts.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(otherPosts.length / itemsPerPage)
    const user_id = useUserData()?.user_id
    const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1)
    const [sliderSettings] = useState({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
        {breakpoint: 992, settings: {slidesToShow: 2}},
        {breakpoint: 768, settings: {slidesToShow: 2}},
        {breakpoint: 576, settings: {slidesToShow: 1}}
        ]
    });

    React.useEffect(() => {
        if (logoutMessage) {
            setMessage(logoutMessage);
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [logoutMessage]);

    const fetchPosts = async () => {
        try {
            setLoading(true)
            const [
                response_post,
                response_category,
                response_user_count
            ] = await Promise.all([
                apiInstance.get(`post/lists/`),
                apiInstance.get(`post/category/list/`),
                apiInstance.get(`user/count/`)
            ]);
            let filteredPosts = [];
            if (response_post.data && response_post.data.results) {
                filteredPosts = response_post.data.results.filter(post => {
                    const status = post.status.toLowerCase()
                    return status !== "draft" && status !== "disabled" && status !== "پیش‌ نویس" && status !== "غیرفعال"
                })
                setPosts(filteredPosts)
            } else {
                console.error("Invalid posts response format:", response_post.data);
            }
            // setActivePostCount(filteredPosts.length)
            // Calculate filtered post counts per category
            const filteredPostsByCategory = {}
            filteredPosts.forEach(post => {
                if (post.category && post.category.id) {
                    filteredPostsByCategory[post.category.id] = (filteredPostsByCategory[post.category.id] || 0) + 1
                }
            })
            // Update categories with filtered post counts
            const updatedCategories = response_category.data.map(cat => {
                return {
                    ...cat,
                    post_count: filteredPostsByCategory[cat.id] || 0
                }
            })
            setCategory(updatedCategories)
            // Set user count from API response
            if (response_user_count && response_user_count.data && typeof response_user_count.data.user_count === "number") {
                setAuthenticatedUserCount(response_user_count.data.user_count)
            }
        } catch (error) {
            if (error.response) {
                console.error("API response error:", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("API no response received:", error.request);
            } else {
                console.error("API error:", error.message);
            }
            console.log(error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchPosts();
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await apiInstance.get('user/all/');
            setUsersData(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }
    useEffect(() => {
        async function fetchData() {
            await fetchUsers();
        }
        fetchData();
    }, [user_id])

    return (
        <>
            <div style={{direction: "rtl", textAlign: "right"}}>
                <section className="pt-4 pb-4 custom-section-color">
                    <div className="container mt-4">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <h2 className="text-end mb-3">سخن اول</h2>
                                <p className="text-end mb-5 mt-5">
                                    نام "شهرزنان" از داستان‌های کهن ایرانی الهام گرفته شده است. شهرزاد، نماد زن دانا، باهوش و شجاع، با داستان‌سرایی خود نه تنها جان خود را نجات داد، بلکه الهام بخش نسل‌های بعدی زنان شد.
                                </p>
                                <p>
                                    ما نیز در شرکت شهرزنان، می‌خواهیم الهام بخش زنان باشیم تا با استفاده از توانایی‌ها و خلاقیت خود، به موفقیت‌های بزرگی دست یابند. اهداف ما توانمندسازی اقتصادی زنان، ارائه آموزش‌های تخصصی، مشاوره‌های کسب‌وکار، ایجاد شبکه‌ای قوی از زنان کارآفرین می‌باشد.
                                <Link to={"/about/"} className="btn btn-outline-success me-4 mt-1">
                                    بیشتر بدانید
                                </Link>
                                </p>
                            </div>
                            <div className="col-md-6 align-self-end">
                                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <img loading="lazy" src="/main-image.webp" className="main-image" style={{zIndex: 3}}/>
                                        {/* Image slider inside the phone */}
                                        <ImageSlider />
                                    <img loading="lazy" src="/accessory1.webp" className="around-image image1" style={{zIndex: 1}} />
                                    <img loading="lazy" src="/accessory2.webp" className="around-image image2" />
                                    <img loading="lazy" src="/accessory3.webp" className="around-image image3" />
                                    <img loading="lazy" src="/accessory4.webp" className="around-image image4" />
                                </div>
                                <div className="counter-section" style={{position: "static"}}>
                                    <div>
                                        <div>
                                            <span>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {authenticatedUserCount}
                                                </p>
                                            </span>
                                            <span>
                                                <p>
                                                    شهروند
                                                </p> 
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <span>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {newsPosts.length}
                                                </p>
                                            </span>
                                            <span>
                                                
                                                <p>
                                                    اخبار
                                                </p>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <span>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {otherPosts.length}
                                                </p>
                                            </span>
                                            <span>
                                                <p>
                                                    مقالات
                                                </p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="pt-4 pb-4">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2 className="text-end d-block mt-1 pt-4 pb-4">جدیدترین اخبار</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            {newsPosts.slice(0, 4).map((post) => (
                                <div className="col-sm-6 col-lg-3 post-title-container" key={post?.id} style={{overflow: "hidden"}}>
                                    <div className="card mb-4">
                                        <div className="card-fold position-relative">
                                            <img 
                                                className="card-img" 
                                                style={{ width: "100%", height: "160px", objectFit: "cover" }} 
                                                src={post?.image && post.image.trim() !== "" ? post.image : "/Loader.gif"} 
                                                alt="Card image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const shimmerContainer = document.createElement('div');
                                                    shimmerContainer.style.cssText = `
                                                        width: 100%;
                                                        height: 160px;
                                                        background-color: #f0f0f0;
                                                        border-radius: 4px;
                                                        position: relative;
                                                        overflow: hidden;
                                                    `;
                                                    shimmerContainer.innerHTML = `
                                                        <div style="
                                                            position: absolute;
                                                            top: 0;
                                                            left: 0;
                                                            width: 100%;
                                                            height: 100%;
                                                            background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
                                                            animation: shimmer 1.5s infinite;
                                                        "></div>
                                                        <style>
                                                            @keyframes shimmer {
                                                                0% { transform: translateX(-100%); }
                                                                100% { transform: translateX(100%); }
                                                            }
                                                        </style>
                                                    `;
                                                    e.target.parentNode.insertBefore(shimmerContainer, e.target.nextSibling);
                                                }}
                                            />
                                        </div>
                                        <div className="card-body px-3 pt-3">
                                            <h4 className="card-title" style={{overflow: "hidden", whiteSpace: "nowrap"}}>
                                                <Link to={`/post/${post.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none post-title-text" title={post?.title}>
                                                    {post?.title?.length > 15 ? post?.title?.substring(0, 15) + "…" : post?.title}
                                                </Link>
                                            </h4>
                                            <button style={{ border: "none", background: "none" }}>
                                                <i className="fas fa-bookmark text-danger"></i>
                                            </button>
                                            <button style={{ border: "none", background: "none" }}>
                                                <i className="fas fa-thumbs-up text-primary"></i>
                                            </button>
                                            <i className="fas fa-eye"></i> {post?.view}                                            
                                            <ul className="mt-3 list-style-none" style={{ listStyle: "none", paddingRight: 0 }}>
                                                <li>
                                                    <a href="#" className="text-dark text-decoration-none">
                                                        <i className="fas fa-user"></i> {post?.user?.full_name}
                                                    </a>
                                                </li>
                                                <li className="mt-2">
                                                    <i className="fas fa-calendar"></i> {Momment(post.date)}
                                                </li>                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <nav className="d-flex justify-content-center mt-2">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link text-dark fw-bold me-1 rounded"
                                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        <i className="fas fa-arrow-right ms-2" style={{ fontSize: "0.75rem" }} />
                                        قبل
                                    </button>
                                </li>
                            </ul>
                            <ul className="pagination">
                                {pageNumbers?.map((number) => (
                                    <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                        <button
                                            className="page-link text-dark fw-bold rounded"
                                            style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                                            onClick={() => setCurrentPage(number)}
                                        >
                                            {number}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link text-dark fw-bold ms-1 rounded"
                                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        بعد
                                        <i className="fas fa-arrow-left me-3" style={{ fontSize: "0.75rem" }} />
                                    </button>
                                </li>
                            </ul>
                            <ul>
                                <Link to={"/news/"} className="btn btn-outline-primary" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>
                                    مشاهده همه
                                </Link>
                            </ul>
                        </nav>
                    </div>
                </section>

                <section className="pt-4 pb-4 custom-bg-yellow"> 
                    <div className="container mt-4">                        
                        <div className="row align-items-start">
                            <div className="col align-items-center mt-7 mb-5">
                                <p>
                                    از تمام بانوان کارآفرین، سرمایه گذاران و علاقه‌مندان به توسعه پایدار دعوت میکنیم به ما بپیوندند تا باهم دنیایی بهتر و برابر برای همه بسازیم.
                                </p>
                                <p>
                                    با دنیای شهروندان شهرزنان کارآفرین آشنا شوید و از تجربیات آن‌ها بهره ببرید.
                                </p>
                                <br/>
                                <Link to={"/register/"} className="btn btn-success">
                                    به ما بپیوندید
                                </Link>
                                <Link to={"/authors/"} className="btn btn-outline-success me-2">
                                    مشاهده شهروندان
                                </Link>
                            </div> 
                            <div className="col-md-6 align-self-center">
                                <h3 className="mb-5">شهروندان شهرزنان کارآفرین</h3>
                                {usersData && usersData.length > 0 ? (
                                    <Slider {...sliderSettings}>
                                        {usersData.map((user) => (
                                            <div key={user.id} className="text-center px-1">
                                                <div className="avatar avatar-xxl mb-2">
                                                    {(() => {
                                                        // Use K.webp as default image if user.image is not provided, empty, or points to a non-existent default image
                                                        const imgSrc = user.image && user.image.trim() !== "" && !user.image.includes("default-user") ? user.image : "/K.webp";
                                                        return (
                                                            <Link to={`/author-profile/${user.id}`}>
                                                                <img
                                                                    className="avatar-img rounded-circle"
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover", margin: "0 auto", display: "block" }}
                                                                    src={imgSrc}
                                                                    alt="avatar"
                                                                    onError={(e) => {
                                                                        // If the image fails to load, fallback to default image
                                                                        if (e.target.src !== "/K.webp") {
                                                                            e.target.src = "/K.webp";
                                                                        }
                                                                    }}
                                                                />
                                                            </Link>
                                                        );
                                                    })()}
                                                </div>
                                                <h5>{user.full_name || user.username}</h5>
                                                <p className="m-0">{user.bio || "هیچ متنی یافت نشد"}</p>
                                            </div>
                                        ))}
                                    </Slider>
                                ) : (
                                    <p>درحال بازگذاری شهروندان...</p>
                                )}
                            </div>                              
                        </div>
                    </div>       
                </section>

                <section className="pt-4 pb-4">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2 className="text-end d-block mt-1 pt-4 pb-4">جدیدترین مقالات</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            {paginatedOtherPosts?.map((post) => (
                                <div className="col-sm-6 col-lg-3 post-title-container" key={post?.id} style={{overflow: "hidden"}}>
                                    <div className="card mb-4">
                                        <div className="card-fold position-relative">
                                            <img 
                                                className="card-img" 
                                                style={{ width: "100%", height: "160px", objectFit: "cover" }} 
                                                src={post?.image && post.image.trim() !== "" ? post.image : "/Loader.gif"} 
                                                alt="Card image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const shimmerContainer = document.createElement('div');
                                                    shimmerContainer.style.cssText = `
                                                        width: 100%;
                                                        height: 160px;
                                                        background-color: #f0f0f0;
                                                        border-radius: 4px;
                                                        position: relative;
                                                        overflow: hidden;
                                                    `;
                                                    shimmerContainer.innerHTML = `
                                                        <div style="
                                                            position: absolute;
                                                            top: 0;
                                                            left: 0;
                                                            width: 100%;
                                                            height: 100%;
                                                            background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
                                                            animation: shimmer 1.5s infinite;
                                                        "></div>
                                                        <style>
                                                            @keyframes shimmer {
                                                                0% { transform: translateX(-100%); }
                                                                100% { transform: translateX(100%); }
                                                            }
                                                        </style>
                                                    `;
                                                    e.target.parentNode.insertBefore(shimmerContainer, e.target.nextSibling);
                                                }}
                                            />
                                        </div>
                                        <div className="card-body px-3 pt-3">
                                            <h4 className="card-title" style={{overflow: "hidden", whiteSpace: "nowrap"}}>
                                                <Link to={`/post/${post.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none post-title-text" title={post.title}>
                                                    {post.title.length > 18 ? post.title.substring(0, 18) + "…" : post.title}
                                                </Link>
                                            </h4>
                                            <ul className="mt-3 list-style-none" style={{ listStyle: "none", paddingRight: 0 }}>
                                                <li>
                                                    <a href="#" className="text-dark text-decoration-none">
                                                        <i className="fas fa-user"></i> {post?.user?.full_name}
                                                    </a>
                                                </li>
                                                <li className="mt-2">
                                                    <i className="fas fa-calendar"></i> {Momment(post.date)}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <nav className="d-flex justify-content-center mt-2">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link text-dark fw-bold me-1 rounded" onClick={() => setCurrentPage(currentPage - 1)} style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>
                                        <i className="fas fa-arrow-right ms-2" />
                                        قبل
                                    </button>
                                </li>
                            </ul>
                            <ul className="pagination">
                                {pageNumbers?.map((number) => (
                                    <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                        <button className="page-link text-dark fw-bold rounded" onClick={() => setCurrentPage(number)} style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>
                                            {number}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link text-dark fw-bold ms-1 rounded" onClick={() => setCurrentPage(currentPage + 1)} style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>
                                        بعد
                                        <i className="fas fa-arrow-left me-3 " />
                                    </button>
                                </li>
                            </ul>
                            <ul>
                                <Link to={"/all-posts/"} className="btn btn-outline-primary" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>
                                    مشاهده همه
                                </Link>
                            </ul>
                        </nav>
                    </div>
                </section>

                <ServiceSection />

                <CategorySlider category={category} />               
            </div>
        </>
    );
}

export default Index;
