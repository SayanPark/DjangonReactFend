import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import ShimmerImage from "../../components/ShimmerImage";

function Dashboard() {
    const [stats, setStats] = useState([])
    const [posts, setPost] = useState([])
    const [comments, setComment] = useState([])
    const [contactMessages, setContactMessages] = useState([])
    const [noti, setNoti] = useState([])

    const user_id = useUserData()?.user_id

    const fetchDashboardData = async () => {
        const stats_res = await apiInstance.get(`author/dashboard/stats/${user_id}/`)
        const post_res = await apiInstance.get(`author/dashboard/post-list/${user_id}/`)
        const comment_res = await apiInstance.get(`author/dashboard/comment-list/${user_id}/`)
        const contact_res = await apiInstance.get(`contact-message/list/`)
        const noti_res = await apiInstance.get(`author/dashboard/noti-list/${user_id}/`)
        setStats(stats_res?.data[0])
        setPost(post_res?.data)
        setComment(comment_res?.data)
        setContactMessages(contact_res?.data)
        setNoti(noti_res?.data)  
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    return (
        <>
            <section className="py-4" style={{ direction: "rtl" }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="row g-4">
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-success bg-opacity-10 rounded-3 text-success">
                                                <i className="bi bi-people-fill" />
                                            </div>
                                            <div className="me-3">
                                                <h3>{stats?.views || "0"}</h3>
                                                <h6 className="mb-0">مجموع بازدید‌ها</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-primary bg-opacity-10 rounded-3 text-primary">
                                                <i className="bi bi-file-earmark-text-fill" />
                                            </div>
                                            <div className="me-3">
                                                <h3>{stats?.posts || "0"}</h3>
                                                <h6 className="mb-0">تعداد پست‌ها</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-danger bg-opacity-10 rounded-3 text-danger">
                                                <i className="bi bi-suit-heart-fill" />
                                            </div>
                                            <div className="me-3">
                                                <h3>{stats?.likes || "0"}</h3>
                                                <h6 className="mb-0">مجموع لایک‌ها</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-info bg-opacity-10 rounded-3 text-info">
                                                <i className="bi bi-tag" />
                                            </div>
                                            <div className="me-3">
                                                <h3>{stats?.bookmarks || "0"}</h3>
                                                <h6 className="mb-0">تعداد ذخیره‌ها</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <h5 className="card-header-title mb-0">آخرین پست‌ها</h5>
                                        <Link to="/add-post/" className="btn btn-primary btn-sm" role="button" id="dropdownShare3">
                                            ایجاد پست <i className="fas fa-plus fa-fw"/>
                                        </Link>
                                    </div>
                                    <div className="dropdown text-end">
                                        <Link to="/posts/" className="btn border-0 p-0 mb-0" role="button" id="dropdownShare3">
                                            <i className="bi bi-grid-fill text-danger fa-fw"/>
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    <div className="row">
                                        {posts?.slice(0, 3)?.map((p, index) => (
                                            <React.Fragment key={p.id || index}>
                                                <div className="col-12">
                                                    <div className="d-flex position-relative">
                                                        <img 
                                                            className="w-60 rounded" 
                                                            src={p?.image} 
                                                            style={{ width: "100px", height: "110px", objectFit: "cover", borderRadius: "10px" }} 
                                                            alt="product" 
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                const shimmerContainer = document.createElement('div');
                                                                shimmerContainer.style.cssText = 'width: 100px; height: 110px;';
                                                                shimmerContainer.innerHTML = `
                                                                    <div style="
                                                                        width: 100%;
                                                                        height: 100%;
                                                                        background-color: #f0f0f0;
                                                                        border-radius: 10px;
                                                                        position: relative;
                                                                        overflow: hidden;
                                                                    ">
                                                                        <div style="
                                                                            position: absolute;
                                                                            top: 0;
                                                                            left: 0;
                                                                            width: 100%;
                                                                            height: 100%;
                                                                            background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
                                                                            animation: shimmer 1.5s infinite;
                                                                        "></div>
                                                                    </div>
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
                                                        <div className="me-3">
                                                            <Link to={`/post/${p?.slug}`} className="h6 stretched-link text-decoration-none text-dark">
                                                                {p.title}
                                                            </Link>
                                                            <p className="small mb-0 mt-3">
                                                                <i className="fas fa-calendar ms-2"></i>{Moment(p.date)}
                                                            </p>
                                                            <p className="small mb-0">
                                                                <i className="fas fa-eye ms-2"></i>{p.view}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className="my-3" />
                                            </React.Fragment>
                                        ))}
                                        
                                    </div>
                                </div>
                                <div className="card-footer border-top text-center p-3">
                                    <Link to="/posts/" className="fw-bold text-decoration-none text-primary">
                                        مشاهده تمامی پست‌ها
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                    <h5 className="card-header-title mb-0">نظرات اخیر</h5>
                                    <div className="dropdown text-end">
                                        <Link to="/comments/" className="btn border-0 p-0 mb-0" role="button" id="dropdownShare3">
                                            <i className="bi bi-chat-left-quote-fill text-success fa-fw" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    <div className="row">
                                        {[...comments, ...contactMessages]?.slice(0, 3)?.map((c, index) => (
                                            <React.Fragment key={c.id || index}>
                                                <div className="col-12">
                                                    <div className="d-flex align-items-center position-relative">
                                                        <Link to="/comments/" className="h6 stretched-link text-decoration-none text-dark">
                                                            <div className="avatar avatar-lg flex-shrink-0">
                                                                <img 
                                                                    className="avatar-img" 
                                                                    src={c?.image || "/K.webp"} 
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} 
                                                                    alt="avatar" 
                                                                    onError={(e) => {
                                                                        // If the image fails to load, fallback to default image
                                                                        if (e.target.src !== "/K.webp") {
                                                                            e.target.src = "/K.webp";
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="me-3">
                                                                <p className="mb-1">                                           
                                                                    {" "}
                                                                    {c?.comment || c?.message}
                                                                </p>
                                                                <div className="d-flex justify-content-between">
                                                                    <p className="small mb-0">
                                                                        <i className={c?.message ? "fa fa-envelope text-warning" : "bi bi-chat-left-quote-fill text-success"}></i>
                                                                        <i className="me-1">توسط </i>{c?.name}
                                                                        {c?.message && <span className="text-warning fw-bold"> (پیام تماس) </span>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <hr className="my-3" />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="card-footer border-top text-center p-3">
                                    <Link to="/comments/" className="fw-bold text-decoration-none text-primary">
                                        مشاهده تمامی نظرات
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
