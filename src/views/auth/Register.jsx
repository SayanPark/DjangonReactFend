import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendSignupEmail } from "../../utils/auth";
import Toast from "../../plugin/Toast";

function Register() {
    const [bioData, setBioData] = useState({ email: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setBioData({ email: "" });
    };

    const mapErrorToPersian = (error) => {
        if (!error) return "";
        const message =
            typeof error === "string" ? error : error.message || JSON.stringify(error);
        if (
            message.includes("User already exists") ||
            message.includes("این ایمیل قبلا ثبت شده است") ||
            message.includes("Request failed with status code 400")
        ) {
            return "این ایمیل قبلا ثبت شده است";
        }
        if (message.includes("Invalid email")) {
            return "ایمیل وارد شده معتبر نیست.";
        }
        if (message.includes("Network Error")) {
            return "خطای شبکه. لطفا اتصال اینترنت خود را بررسی کنید.";
        }
        return "خطایی رخ داده است: " + message;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await sendSignupEmail(bioData.email);
        if (error) {
            Toast("error", mapErrorToPersian(error));
            resetForm();
        } else {
            Toast("success", "ایمیل تایید ثبت نام ارسال شد. لطفا ایمیل خود را بررسی کنید.");
            navigate("/");
        }
        setIsLoading(false);
    };

    return (
        <>
            <section
                className="container d-flex flex-column vh-100"
                style={{ marginTop: "150px", direction: "rtl" }}
            >
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">ثبت نام کنید</h1>
                                    <span>
                                        قبلا عضو شدید؟
                                        <Link to="/login/" className="me-1">
                                            اینجا کلیک کنید
                                        </Link>
                                    </span>
                                </div>
                                {/* Form */}
                                <form
                                    onSubmit={handleRegister}
                                    className="needs-validation"
                                    noValidate=""
                                >
                                    {/* Email */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            ایمیل خود را وارد کنید
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            onChange={handleBioDataChange}
                                            value={bioData.email}
                                            name="email"
                                            placeholder="ایمیل"
                                            required=""
                                        />
                                        <div className="invalid-feedback">
                                            لطفا ایمیل معتبر وارد کنید.
                                        </div>
                                    </div>

                                    <div>
                                        <div className="d-grid">
                                            {isLoading === true ? (
                                                <button disabled type="submit" className="btn btn-primary">
                                                    صبر کنید <i className="fas fa-spinner fa-spin"></i>
                                                </button>
                                            ) : (
                                                <button type="submit" className="btn btn-primary">
                                                    ثبت نام <i className="fas fa-user-plus"></i>
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
        </>
    );
}

export default Register;
