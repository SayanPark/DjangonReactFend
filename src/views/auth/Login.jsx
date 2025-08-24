import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";

function Login() {
    const [bioData, setBioData] = useState({ identifier: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // On component mount, check if email is saved in localStorage
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setBioData((prev) => ({ ...prev, identifier: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
    };

    const resetForm = () => {
        setBioData({
            identifier: "",
            password: "",
        });
        setRememberMe(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await login(bioData.identifier, bioData.password);
        if (error) {
            alert(JSON.stringify(error));
            resetForm();
        } else {
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", bioData.identifier);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
            navigate("/");
        }

        setIsLoading(false);
    };

    return (
        <>
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px", direction: "rtl" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">وارد شوید</h1>
                                    <span>
                                        اکانت ندارید؟
                                        <Link to="/register/" className="me-1">
                                            اینجا ثبت نام کنید
                                        </Link>
                                    </span>
                                </div>
                                {/* Form */}
                                <form className="needs-validation" noValidate="" onSubmit={handleLogin}>
                                    {/* Username */}
                                    <div className="mb-3">
                                        <label htmlFor="identifier" className="form-label">
                                            ایمیل
                                        </label>
                                        <input type="text" onChange={handleBioDataChange} value={bioData.identifier} id="identifier" className="form-control" name="identifier" placeholder="ایمیل خود را وارد کنید" required="" />
                                    </div>
                                    {/* Password */}
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            رمز عبور
                                        </label>
                                        <input type="password" onChange={handleBioDataChange} value={bioData.password} id="password" className="form-control" name="password" placeholder="**************" required="" />
                                    </div>
                                    {/* Checkbox */}
                                    <div className="d-lg-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="rememberme" checked={rememberMe} onChange={handleRememberMeChange} />
                                            <label className="form-check-label" htmlFor="rememberme">
                                                مرا بخاطر بسپار
                                            </label>
                                        </div>
                                        <div>
                                            <Link to="/forgot-password/">رمز عبور خود را فراموش کردید؟</Link>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-grid">
                                            <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
                                                {isLoading ? (
                                                    <>
                                                        <span className="ms-2 ">صبرکنید</span>
                                                        <i className="fas fa-spinner fa-spin" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="ms-2">ورود</span>
                                                        <i className="fas fa-sign-in-alt" />
                                                    </>
                                                )}
                                            </button>
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

export default Login;
