import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import Momment from "../../plugin/Moment";
import { Link } from "react-router-dom";

function AllPosts() {
    const itemsPerPage = 12;
    const maxRows = 3;
    const postsPerRow = 4;
    const maxPostsToShow = maxRows * postsPerRow;

    const [posts, setPosts] = useState([]);
    const [postsToShow, setPostsToShow] = useState(itemsPerPage);
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiInstance.get("post/lists/");
                // Filter out posts with category title "اخبار"
                if (response.data && response.data.results) {
                    const filteredPosts = response.data.results.filter(post => {
                        const status = post.status.toLowerCase();
                        const categoryTitle = post.category?.title || "";
                        return status !== "draft" && status !== "disabled" && status !== "پیش‌ نویس" && status !== "غیرفعال" && categoryTitle !== "اخبار";
                    });
                    setPosts(filteredPosts);
                } else {
                    console.error("Invalid response format:", response.data);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, []);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const sortedPosts = [...posts];
    if (sortOrder === "Newest") {
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === "Oldest") {
        sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const currentPosts = sortedPosts.slice(0, postsToShow);

    const handleLoadMore = () => {
        setPostsToShow((prev) => Math.min(prev + postsPerRow, maxPostsToShow));
    };

    const canLoadMore = postsToShow < Math.min(posts.length, maxPostsToShow);

    return (
        <div className="justify-content-center me-4" style={{ direction: "rtl", textAlign: "right", marginLeft:"24px" }}>
            <div className="row mb-4 me-1 md-0">
                <div className="col-md-3">
                    <h2 className="mt-4">مقالات</h2>
                    <form>
                        <select
                            onChange={handleSortChange}
                            value={sortOrder}
                            className="form-select z-index-9 bg-transparent"
                            aria-label=".form-select-sm"
                        >
                            <option value="">مرتب سازی براساس</option>
                            <option value={"Newest"}>جدیدترین</option>
                            <option value={"Oldest"}>قدیمی‌ترین</option>
                        </select>
                    </form>
                </div>
            </div>
            <div className="row me-1 md-1" style={{ margin: "0", padding:"0" }}>
                {currentPosts.map((post) => (
                    <div
                        className="col-sm-6 col-lg-3 post-title-container"
                        key={post.id}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="card mb-4">
                            <div className="card-fold position-relative">
                                <img
                                    className="card-img"
                                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                    src={post.image}
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
                                <h4 className="card-title" style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                                    <Link
                                        to={`/post/${post.slug}`}
                                        className="btn-link text-reset stretched-link fw-bold text-decoration-none post-title-text"
                                        title={post.title}
                                    >
                                        {post.title.length > 18 ? post.title.substring(0, 18) + "…" : post.title}
                                    </Link>
                                </h4>
                                <ul className="mt-3 list-style-none" style={{ listStyle: "none", paddingRight: 0 }}>
                                    <li>
                                        <a href="#" className="text-dark text-decoration-none">
                                            <i className="fas fa-user"></i> {post.user?.full_name}
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
            {canLoadMore && (
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-primary" onClick={handleLoadMore}>
                        مشاهده بیشتر
                    </button>
                </div>
            )}
        </div>
    );
}

export default AllPosts;
