import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Page404 from "../pages/Page404";
import Loading from "../UI/Loading";
import apiInstance from "../../utils/axios";
import Momment from "../../plugin/Moment";

function Search() {
    const { searchTerm } = useParams();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiInstance.get("post/lists/");
                console.log("API response data:", response.data);
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else if (response.data && Array.isArray(response.data.results)) {
                    setPosts(response.data.results);
                } else {
                    setPosts([]);
                    console.warn("Unexpected API response structure for posts");
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        if (!loading && Array.isArray(posts)) {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (post.description && typeof post.description === 'string' && post.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(null);
        }
    }, [loading, posts, searchTerm]);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const sortedPosts = filteredPosts ? [...filteredPosts] : [];

    if (sortOrder === "Newest") {
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === "Oldest") {
        sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (loading) {
        return (
            <div 
                style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    height: "calc(100vh - 120px)" 
                }}
            >
                <Loading />
            </div>
        );
    }

    if (filteredPosts === null) {
        // Still filtering or no data yet, show nothing
        return null;
    }

    if (filteredPosts.length === 0) {
        return <Page404 />;
    }

    return (
        <div style={{ direction: "rtl" }}>
            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt="" />
                            </a>
                            <h2 className="text-end d-block mt-1">
                                <i className="fas fa-search"></i> نتایج جستجو برای "{searchTerm}"
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0 mt-4">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-3">
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
                    <div className="row">
                        {sortedPosts.map((post) => (
                            <div key={post.id} className="col-sm-6 col-lg-3">
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img
                                            className="card-img"
                                            style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                            src={post.image || "https://via.placeholder.com/300x160"}
                                            alt={post.title}
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
                                    <div className="card-body px-3 pt-3" style={{ textAlign: "right" }}>
                                        <h4 className="card-title">
                                            <Link to={`/post/${post.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none post-title-text" title={post.title}>
                                                {post.title.length > 18 ? post.title.substring(0, 18) + "…" : post.title}
                                            </Link>
                                        </h4>
                                        <ul className="mt-3 list-style-none" style={{ listStyle: "none", paddingRight: 0, paddingLeft: "1rem" }}>
                                            <li>
                                                <span className="text-dark">
                                                    <i className="fas fa-user"></i> {post?.user?.full_name || "Unknown"}
                                                </span>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {Momment(post.date)}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {post.view || 0}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Search;


