import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import "./ProfileList.css";

function ProfileList() {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(25);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await apiInstance.get('user/all/');
                setUsersData(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Limit to displayCount users
    const displayedUsers = usersData.slice(0, displayCount);

    const handleShowMore = () => {
        setDisplayCount(prevCount => prevCount + 25);
    };

    return (
        <>
            <section className="pt-4 p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h2 className="text-end d-block mt-1">شهروندان شهرزنان</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="profile-grid mt-5 mb-5">
                {loading ? (
                    <p>Loading authors...</p>
                ) : (
                    <>
                        {displayedUsers.map(user => (
                            <Link key={user.id} to={`/author-profile/${user.id}`} className="text-center px-1 fade-in" style={{ textDecoration: "none", color: "inherit" }}>
                                <div className="avatar avatar-xxl mb-2">
                                    {(() => {
                                        // Use image_url if available, otherwise fallback to image field or default
                                        const imgSrc = user.image_url || (user.image && user.image.trim() !== "" && !user.image.includes("default-user") ? user.image : "/K.webp");
                                        return (
                                            <img
                                                className="avatar-img rounded-circle"
                                                style={{ width: "100px", height: "100px", objectFit: "cover", margin: "0 auto", display: "block" }}
                                                src={imgSrc}
                                                alt="avatar"
                                                onError={(e) => { 
                                                    e.target.onerror = null; 
                                                    e.target.src = "/K.webp"; 
                                                }}
                                            />
                                        );
                                    })()}
                                </div>
                                <h5>{user.full_name || user.username}</h5>
                                <p className="m-0">{user.bio || user.about || "هیچ متنی یافت نشد"}</p>
                            </Link>
                        ))}
                    </>
                )}
            </section>
            {displayCount < usersData.length && !loading && (
                <div className="text-center mt-3 mb-5">
                    <button onClick={handleShowMore} className="btn btn-primary">
                        مشاهده بیشتر
                    </button>
                </div>
            )}
        </>
        
    );
}

export default ProfileList;
