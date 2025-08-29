import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { logout } from "../../utils/auth";
import apiInstance from "../../utils/axios";
import logo from "/logo-removebg-preview.webp";
import "../core/DropdownColumnsFix.css";

function Header() {    
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [hasUnansweredContactMessages, setHasUnansweredContactMessages] = useState(false);
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const loggedIn = isLoggedIn();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let timer;
        if (showLogoutPopup) {
            timer = setTimeout(() => {
                setShowLogoutPopup(false);
                navigate("/");
            }, 1500);
        }
        return () => clearTimeout(timer);
    }, [showLogoutPopup]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await apiInstance.get("post/category/list/");
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = () => {
        logout(false);
        setShowLogoutPopup(true);
    };

    const fetchUnansweredContactMessages = async () => {
        if (!loggedIn) {
            setHasUnansweredContactMessages(false);
            return;
        }
        try {
            const response = await apiInstance.get("contact-message/list/");
            // Filter messages that are not responded
            const unanswered = response.data.some(msg => !msg.responded);
            setHasUnansweredContactMessages(unanswered);
        } catch (error) {
            console.error("Failed to fetch contact messages:", error);
        }
    };

    useEffect(() => {
        fetchUnansweredContactMessages();
        // Add event listener for contactMessagesUpdated event to refetch unanswered messages
        const handleContactMessagesUpdated = () => {
            if (!loggedIn) {
                setHasUnansweredContactMessages(false);
                return;
            }
            fetchUnansweredContactMessages();
        };
        window.addEventListener('contactMessagesUpdated', handleContactMessagesUpdated);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('contactMessagesUpdated', handleContactMessagesUpdated);
        };
    }, [loggedIn]);

    // New effect to update green dot on route change
    useEffect(() => {
        fetchUnansweredContactMessages();
    }, [location]);

    return (
        <>
            <style>{`
                @keyframes fadeIn {from { opacity: 0; } to { opacity: 1; }}
                @keyframes progressBar {from { width: 0%; } to { width: 100%; }}
                .logout-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1050;
                    animation: fadeIn 0.3s ease forwards;
                }
                .progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 4px;
                    background-color: #0d6efd;
                    animation: progressBar 1.5s linear forwards;
                }
                .logout-popup-content {
                    position: relative;
                }
                input::placeholder {
                    color: white !important;
                    opacity: 0.5 !important;
                }
                button.btn.bg-transparent.border-0.px-2.py-0.position-absolute.top-50.end-0.translate-middle-y {
                    color: white;
                }
                @media (max-width: 575px) {
                    .logout-button {
                        padding-left: 27px !important;
                        padding-right: 27px !important;
                    }
                }
                @media (min-width: 992px) and (max-width: 1199px) {
                    /* Keep logo size same */
                    .navbar-brand-item {
                        width: 50px !important;
                    }
                    /* Reduce size of nav links */
                    .nav-link {
                        font-size: 0.85rem;
                        padding: 0.25rem 0.5rem;
                    }
                    /* Reduce size of buttons */
                    .btn {
                        font-size: 0.85rem;
                        padding: 0.25rem 0.5rem;
                    }
                    /* Reduce size of form input */
                    .form-control {
                        font-size: 0.85rem;
                        padding: 0.25rem 0.5rem;
                    }
                    /* Reduce size of dropdown menu items */
                    .dropdown-menu .dropdown-item {
                        font-size: 0.85rem;
                        padding: 0.25rem 0.5rem;
                    }
                    /* Reduce size of navbar-toggler text */
                    .navbar-toggler .h6 {
                        font-size: 0.85rem;
                    }
                }
                @media (max-width: 991px) {
                    ul {
                        padding-right: 0 !important;
                    }
                }
                /* Make font size a little smaller for departments dropdown menu */
                .dropdown-menu.dropdown-menu-end.dropdown-menu-columns {
                    font-size: 0.85rem;
                }
            `}</style>
            <header className="navbar-dark navbar-sticky header-static" style={{ backgroundColor: '#887298' }}>
                <nav className="navbar navbar-expand-lg">
                    <div className="container" style={{ direction: "rtl" }}>
                        <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="h6 d-none d-sm-inline-block text-white">منو</span>
                            <span className="navbar-toggler-icon" />
                        </button>
                        <Link className="navbar-brand" to="/">
                            <img className="navbar-brand-item dark-mode-item" src={logo} style={{ width: "50px" }} alt="logo" />
                        </Link>
                        <div className="collapse navbar-collapse" id="navbarCollapse">
                            <div className="nav mt-3 mt-lg-0 px-4 flex-nowrap align-items-center">
                                <div className="nav-item w-100">
                                    <form className="rounded position-relative" onSubmit={(e) => {
                                        e.preventDefault();
                                        if (searchTerm.trim() !== "") {
                                            navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
                                        }
                                    }}>
                                        <input
                                            className="form-control pe-5 text-end"
                                            type="search"
                                            placeholder="جستجو کنید"
                                            aria-label="Search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ border: "none", boxShadow: "none", backgroundColor: "#665672", color: "white" }}
                                        />
                                        <button
                                            type="submit"
                                            className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                                        >
                                            <i className="bi bi-search fs-5"> </i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <ul className="navbar-nav navbar-nav-scroll ms-auto" >
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        خانه
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/all-posts">
                                        مقالات
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/news">
                                        اخبار
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/services">
                                        خدمات
                                    </Link>
                                </li>
                                <li className="nav-item dropdown" style={{ direction: "rtl" }}>
                                    <button className="nav-link dropdown-toggle btn btn-link" type="button" style={{ direction: "rtl" }} id="departmentsMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        دپارتمان‌ها
                                    </button>
                                    {loadingCategories ? (
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="departmentsMenu" style={{ direction: "rtl", textAlign: "right", marginTop: 0 }}>
                                            <li className="dropdown-item text-center">در حال بارگذاری...</li>
                                        </ul>
                                    ) : (
                                        (() => {
                                            const iconMap = [
                                                "bi bi-globe-central-south-asia",
                                                "fas fa-utensils",
                                                "fas fa-tractor",
                                                "fas fa-tshirt",
                                                "fas fa-fan",
                                                "fas fa-wine-glass",
                                                "fas fa-building",
                                                "fas fa-plus-square",
                                                "fas fa-users"
                                            ];
                                            const filteredCategories = categories.filter(cat => cat.title !== "اخبار");
                                            const departments = filteredCategories.map((cat, index) => ({
                                                to: `/category/${cat.slug}/`,
                                                icon: iconMap[index] || "fas fa-folder",
                                                label: cat.title
                                            }));
                                            const firstColumn = departments.slice(0, 5);
                                            const secondColumn = departments.slice(5);
                                            return (
                                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-columns" aria-labelledby="departmentsMenu" style={{ direction: "rtl", textAlign: "right" }} aria-expanded="false">
                                                    <>
                                                        {firstColumn.map((dept, index) => (
                                                            <li key={index}>
                                                                <Link className="dropdown-item" to={dept.to} aria-current="false" aria-disabled="false">
                                                                    <i className={dept.icon}></i> {dept.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </>
                                                    <>
                                                        {secondColumn.map((dept, index) => (
                                                            <li key={index}>
                                                                <Link className="dropdown-item" to={dept.to} aria-current="false" aria-disabled="false">
                                                                    <i className={dept.icon}></i> {dept.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </>
                                                </ul>
                                            );
                                        })
                                    ()
                                )}
                                </li>
                                <li className="nav-item dropdown" style={{ direction: "rtl" }}>
                                    <a className="nav-link dropdown-toggle" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        آشنایی با ما
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="pagesMenu" style={{ direction: "rtl", textAlign: "right" }}>
                                        <li>
                                            <Link className="dropdown-item" to="/about/">
                                                <i className="bi bi-person-lines-fill"></i> درباره ما
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/contact/">
                                                <i className="bi bi-telephone-fill"></i> تماس با ما
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul className="navbar-nav navbar-nav-scroll me-auto" >
                                <div className="nav-item nav-item-left" >
                                    {loggedIn ? (
                                        <>
                                            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center" style={{gap: "0.5rem"}}>
                                                <div className="nav-item dropdown ms-2 mb-2 mb-sm-0">
                                                    <button className="btn btn-primary dropdown-toggle" id="dashboardMenu" data-bs-toggle="dropdown" aria-expanded="false" type="button" style={{direction: "rtl"}}>
                                                        داشبورد <i className="bi bi-person-fill"></i>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dashboardMenu" style={{ direction: "rtl", textAlign: "right" }}>
                                                        <li>
                                                            <Link className="dropdown-item" to="/dashboard/">
                                                                <i className="bi bi-person-workspace"></i> میزکار
                                                                {hasUnansweredContactMessages && (
                                                                    <span className="badge bg-success rounded-circle ms-2 me-1" style={{ width: "8px", height: "8px", display: "inline-block", padding: 0, borderRadius: "50%" }}></span>
                                                                )}
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to="/profile/">
                                                                <i className="bi bi-person-circle"></i> پروفایل
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <button onClick={handleLogout} className="btn btn-danger ms-2 logout-button">
                                                        خروج <i className="fas fa-sign-out-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Link to={"/login/"} className="btn btn-success ms-2" href="dashboard.html" style={{ backgroundColor: '#609f63', border: "None" }}>
                                            ورود <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    )}
                                </div>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            {showLogoutPopup && (
                <div className="logout-popup-overlay">
                    <div className="logout-popup-content card shadow p-4" style={{ maxWidth: "400px", textAlign: "center", direction: "rtl", position: "relative" }}>
                        <h1 className="mb-1 fw-bold">شما خارج شدید</h1>
                        <span>از بازدید شما از وبسایت متشکریم، هر زمان بازگردید!</span>
                        <div className="progress-bar"></div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
