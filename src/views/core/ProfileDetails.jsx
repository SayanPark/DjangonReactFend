import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";

function ProfileDetail() {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthorAndPosts = async () => {
            try {
                setLoading(true);
                // Fetch author details
                const authorResponse = await apiInstance.get(`user/profile/${id}/`);
                setAuthor(authorResponse.data);

                // Fetch posts by author
                const postsResponse = await apiInstance.get(`author/dashboard/post-list/${id}/`);
                setPosts(postsResponse.data);
            } catch (error) {
                console.error("Failed to fetch author or posts:", error);
                Toast("error", "Failed to load author details or posts.");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthorAndPosts();
    }, [id]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!author) {
        // Navigate to 404 page if author not found
        window.location.href = "/authors/404";
        return null;
    }

    return (
        <>
            <section className="pt-0" style={{ direction: "rtl"}}>
                <div className="container position-relative" data-sticky-container="">
                    <div className="row">
                        <div className="col-lg-2 pt-5">
                            <div className="text-center" data-sticky="" data-margin-top={80} data-sticky-for={991}>
                                <div className="position-relative d-flex flex-column align-items-center">
                                    <div className="avatar avatar-xl">
                                        <img
                                            className="avatar-img"
                                            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                                            src={author.image_url || author.image || "https://i.postimg.cc/RVLb8r7B/K.webp"}
                                            alt="avatar"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://i.postimg.cc/RVLb8r7B/K.webp"; }}
                                        />
                                    </div>
                                    <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 d-block">
                                        {author?.full_name}
                                    </a>
                                    <p>{author?.bio || "هیچ متنی یافت نشد"}</p>
                                </div>
                                <hr className="d-none d-lg-block"/>
                                <p>{author?.about || "هیچ توضیحاتی یافت نشد"}</p>
                            </div>
                        </div>
                        <hr className="d-block d-lg-none w-100 my-2" />
                        <div className="col-lg-10">
                            <section className="pt-5 pb-3">
                                <div className="container">
                                    <div className="row">
                                        {posts.length === 0 ? (
                                            <p>No posts available.</p>
                                        ) : (
                                            posts.filter(post => post.status === "Active").map((post) => (
                                                <div className="col-sm-6 col-lg-4 post-title-container" key={post.id} style={{ overflow: "hidden" }}>
                                                    <div className="card mb-4">
                                                        <div className="card-fold position-relative">
                                                            <img 
                                                                className="card-img" 
                                                                style={{ width: "100%", height: "160px", objectFit: "cover" }} 
                                                                src={post.image} alt="Card image" 
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
                                                                <Link to={`/post/${post.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none post-title-text" title={post.title}>
                                                                    {post.title.length > 18 ? post.title.substring(0, 18) + "…" : post.title}
                                                                </Link>
                                                            </h4>
                                                            <button style={{ border: "none", background: "none" }}>
                                                                <i className="fas fa-bookmark text-danger"></i>
                                                            </button>
                                                            <button style={{ border: "none", background: "none" }}>
                                                                <i className="fas fa-thumbs-up text-primary"></i>
                                                            </button>
                                                            <i className="fas fa-eye"></i> {post.view}
                                                            <ul className="mt-3 list-style-none" style={{ listStyle: "none", paddingRight: 0 }}>
                                                                <li>
                                                                    <a href="#" className="text-dark text-decoration-none">
                                                                        <i className="fas fa-user"></i> {post.user.full_name}
                                                                    </a>
                                                                </li>
                                                                <li className="mt-2">
                                                                    <i className="fas fa-calendar"></i> {Moment(post.date)}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ProfileDetail;
