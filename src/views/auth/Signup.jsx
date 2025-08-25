import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createAccount } from "../../utils/auth";
import Cookies from "js-cookie";
import * as jwtDecode from "jwt-decode";
import Toast from "../../plugin/Toast";

function Signup() {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract email from query params or state passed from Register
    const queryParams = new URLSearchParams(location.search);
    const emailFromLink = queryParams.get("email") || "";

    const [formData, setFormData] = useState({
        email: emailFromLink,
        password: "",
        password2: "",
        first_name: "",
        last_name: "",
        image: null,
        bio: "",
        about: "",
        receiveUpdates: false, // new field for checkbox
    });

    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({
                ...formData,
                image: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const resetForm = () => {
        setFormData({
            email: emailFromLink,
            password: "",
            password2: "",
            first_name: "",
            last_name: "",
            image: null,
            bio: "",
            about: "",
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const mapErrorToPersian = (error) => {
        if (!error) return "";
        const message = typeof error === "string" ? error : error.message || JSON.stringify(error);
        if (message.includes("Network Error")) {
            return "خطای شبکه. لطفا اتصال اینترنت خود را بررسی کنید.";
        }
        return "خطایی رخ داده است: " + message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Clear file input on submit
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        setFormData((prev) => ({ ...prev, image: null }));

        // Prepare form data for submission, including file upload
        const data = new FormData();
        data.append("email", formData.email);
        // Derive username from email (everything before '@')
        const username = formData.email.split("@")[0];
        data.append("username", username);
        // Combine first_name and last_name into full_name
        const fullName = `${formData.first_name} ${formData.last_name}`.trim();
        data.append("full_name", fullName);
        if (formData.image) {
            data.append("image", formData.image);
        }
        data.append("bio", formData.bio);
        data.append("about", formData.about);
        data.append("password", formData.password);
        data.append("password2", formData.password2);
        data.append("receive_updates", formData.receiveUpdates); // send boolean value directly

        const { error } = await createAccount(data);
        if (error) {
            Toast("error", mapErrorToPersian(error));
            resetForm();
        } else {
            Toast("success", "حساب کاربری با موفقیت ایجاد شد.");
            navigate("/login");
        }
        setIsLoading(false);
    };

    return (
        <section className="container d-flex flex-column vh-900 mb-5 mt-5 pt-5 pb-5" style={{ direction: "rtl" }}>
            <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                    <div className="card shadow">
                        <div className="card-body p-6">
                            <div className="mb-4">
                                <h1 className="mb-1 fw-bold">تکمیل ثبت نام</h1>
                            </div>
                            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                                {/* Image */}
                                <div className="d-flex align-items-center mb-4 mb-lg-0">
                                    {(() => {
                                        const imgSrc = formData.image ? URL.createObjectURL(formData.image) : "https://i.postimg.cc/RVLb8r7B/K.webp";
                                        return <img src={imgSrc} id="img-uploaded" className="avatar-xl rounded-circle" alt="avatar" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }} />;
                                    })()}
                                    <div className="me-3">
                                        <h4 className="mb-0">عکس پروفایل</h4>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="form-control mt-3"
                                            name="image"
                                            onChange={handleChange}
                                            id=""
                                            accept=".jpg,.jpeg,.png"
                                            onInput={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const img = new Image();
                                                    img.src = URL.createObjectURL(file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* First Name and Last Name in one row */}
                                <div className="mb-3 d-flex gap-3 mt-4">
                                    <div className="flex-fill">
                                        <label htmlFor="first_name" className="form-label">
                                            نام <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            className="form-control"
                                            onChange={handleChange}
                                            value={formData.first_name}
                                            name="first_name"
                                            placeholder="نام"
                                            required
                                        />
                                        <div className="invalid-feedback">لطفا نام خود را وارد کنید.</div>
                                    </div>
                                    <div className="flex-fill">
                                        <label htmlFor="last_name" className="form-label">
                                            نام خانوادگی <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            className="form-control"
                                            onChange={handleChange}
                                            value={formData.last_name}
                                            name="last_name"
                                            placeholder="نام خانوادگی"
                                            required
                                        />
                                        <div className="invalid-feedback">لطفا نام خانوادگی خود را وارد کنید.</div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">
                                        بیوگرافی <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <textarea
                                        id="bio"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={formData.bio}
                                        name="bio"
                                        placeholder="شغل و یا حرفه‌ی کاری خود را بنویسید"
                                        rows="3"
                                        required
                                    />
                                </div>

                                {/* About */}
                                <div className="mb-3">
                                    <label htmlFor="about" className="form-label">
                                        درباره من
                                    </label>
                                    <textarea
                                        id="about"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={formData.about}
                                        name="about"
                                        placeholder="درباره خودتان بنویسید"
                                        rows="3"
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        رمز عبور <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={formData.password}
                                        name="password"
                                        placeholder="**************"
                                        required
                                    />
                                    <div className="invalid-feedback">لطفا رمز عبور معتبر وارد کنید.</div>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label htmlFor="password2" className="form-label">
                                        تکرار رمز عبور <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password2"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={formData.password2}
                                        name="password2"
                                        placeholder="**************"
                                        required
                                    />
                                    <div className="invalid-feedback">لطفا تکرار رمز عبور را به درستی وارد کنید.</div>
                                </div>

                                {/* Checkbox for receiving updates */}
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="receiveUpdates"
                                        name="receiveUpdates"
                                        checked={formData.receiveUpdates}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                receiveUpdates: e.target.checked,
                                            }))
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="receiveUpdates">
                                        دریافت به‌روزرسانی‌های جدید پست‌ها در ایمیل
                                    </label>
                                </div>

                                <div>
                                    <div className="d-grid">
                                        {isLoading ? (
                                            <button disabled type="submit" className="btn btn-primary">
                                                صبر کنید <i className="fas fa-spinner fa-spin"></i>
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">
                                                ایجاد حساب <i className="fas fa-user-plus"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup;
