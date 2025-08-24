import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";

function Posts() {
    const [posts, setPost] = useState([])
    const user_id = useUserData()?.user_id
    
    const fetchPost = async () => {
        try {
            const post_res = await apiInstance.get(`author/dashboard/post-list/${user_id}/`)
            setPost(post_res?.data)
            console.log(post_res?.data);
            
        } catch (error) {
            console.log(error);            
        }
    }

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        if (query === "") {
            fetchPost()
        } else {
            const filtered = posts.filter((p) => {
                return p.title.toLowerCase().includes(query);
            })
            setPost(filtered)
        }
    }

    const handleSortChange = (e) => {
        const sortValue = e.target.value
        const sortedPosts = [...posts]
        console.log(sortedPosts);
        
        if (sortValue === "Newest") {
            sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
        } else if (sortValue === "Oldest") {
            sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date))
        }
        setPost(sortedPosts)
    }

    useEffect(() => {
        fetchPost()
    }, [])

    return (
        <>
            <section className="py-4" dir="rtl">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            تمامی پست‌ها <span className="badge bg-primary bg-opacity-10 text-primary">{posts?.length}</span>
                                        </h5>
                                        <Link to="/add-post/" className="btn btn-sm btn-primary mb-0">
                                            ایجاد پست <i className="fas fa-plus"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">
                                            <form className="rounded position-relative">
                                                <input onChange={(e) => handleSearch(e)} className="form-control pe-5 bg-transparent" type="search" placeholder="جست‌وجو مقالات" aria-label="Search" />
                                                <button className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                                                    <i className="fas fa-search fs-6 " />
                                                </button>
                                            </form>
                                        </div>
                                        <div className="col-md-3">
                                            <form>
                                                <select onChange={handleSortChange} className="form-select z-index-9 bg-transparent" aria-label=".form-select-sm">
                                                    <option value="">مرتب سازی براساس</option>
                                                    <option value={"Newest"}>جدیدترین</option>
                                                    <option value={"Oldest"}>قدیمی‌ترین</option>
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                    {/* Search and select END */}
                                    {/* Blog list table START */}
                                    <div className="table-responsive border-0">
                                        <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                                            {/* Table head */}
                                            <thead className="table-dark">
                                                <tr>
                                                    <th scope="col" className="border-0 rounded-start">
                                                        عنوان مقاله
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        تعداد بازدید
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        تاریخ انتشار
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        دسته بندی
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        وضعیت
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        تغییرات
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top-0">
                                                {posts?.map((p, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                {(p?.status === "پیش نویس" || p?.status === "غیرفعال" || p?.status === "Draft" || p?.status === "Disabled") ? (
                                                                    <span className="text-secondary text-decoration-none">{p?.title}</span>
                                                                ) : (
                                                                    <Link to={`/post/${p?.slug}`} className="text-dark text-decoration-none">
                                                                        {p?.title}
                                                                    </Link>
                                                                )}
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <a className="text-dark text-decoration-none">
                                                                    {(p?.status === "پیش نویس" || p?.status === "غیرفعال" || p?.status === "Draft" || p?.status === "Disabled") ? (
                                                                        <span className="text-secondary">---</span>
                                                                    ) : (
                                                                        p?.view
                                                                    )}
                                                                </a>
                                                            </h6>
                                                        </td>
                                                        <td>{(p?.status === "پیش نویس" || p?.status === "غیرفعال" || p?.status === "Draft" || p?.status === "Disabled") ? (
                                                            <span className="text-secondary">---</span>
                                                        ) : (
                                                            Moment(p.date)
                                                        )}</td>
                                                        <td>{p?.category?.title}</td>
                                                        <td>
                                                            <span className="badge bg-dark text-white mb-2">{p?.status}</span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2 justify-content-center">
                                                                <a
                                                                    href="#"
                                                                    className="btn-round mb-0 btn btn-danger"
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-placement="top"
                                                                    title="Delete"
                                                                    onClick={async (e) => {
                                                                        e.preventDefault();
                                                                        if (window.confirm("Are you sure you want to delete this post?")) {
                                                                            try {
                                                                                await apiInstance.delete(`author/dashboard/post-detail/${user_id}/${p.id}/`);
                                                                                setPost(posts.filter(post => post.id !== p.id));
                                                                            } catch (error) {
                                                                                console.error("Failed to delete post:", error);
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <i className="bi bi-trash" />
                                                                </a>
                                                                <Link to={`/edit-post/${p?.id}/`} className="btn btn-primary btn-round mb-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                                                    <i className="bi bi-pencil-square" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Posts;
