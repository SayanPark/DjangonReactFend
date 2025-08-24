import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
function CreatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const otp = searchParams.get("otp");
    const uidb64 = searchParams.get("uidb64");
    const reset_token = searchParams.get("reset_token");

    React.useEffect(() => {
        if (!otp || !uidb64 || !reset_token) {
            setError("پارامترهای لازم برای بازنشانی رمز عبور وجود ندارد. لطفاً از لینکی که به ایمیل شما ارسال شده استفاده کنید.");
        }
    }, [otp, uidb64, reset_token]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (error) {
            Toast("error", error);
            return;
        }
        setIsLoading(true);
            if (password !== confirmPassword) {
                setIsLoading(false);
                Toast("warning", "رمز عبور مطابقت ندارد");
            } else {
                setIsLoading(true);

            const payload = {
                otp: otp,
                uidb64: uidb64,
                reset_token: reset_token,
                password: password,
            };

            try {
                const res = await apiInstance.post(`user/password-change/`, payload, { headers: { 'Content-Type': 'application/json' } });
                Toast("success", "رمز شما با موفقیت تغییر کرد");
                navigate("/login");
            } catch (error) {
                console.log(error);
                Toast("error", "خطایی رخ داد، لطفاً دوباره تلاش کنید");
                setIsLoading(false);
            }
        }
    };
    return (
        <>
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px", direction: "rtl" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">نوشتن رمز جدید</h1>
                                    <span>برای اکانت خود یک رمز جدید انتخاب نمایید</span>
                                </div>
                                {error ? (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                ) : (
                                    <form className="needs-validation" onSubmit={handlePasswordSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">
                                                رمز جدید
                                            </label>
                                            <input type="password" className="form-control" placeholder="**************" required autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">
                                                تکرار رمز
                                            </label>
                                            <input type="password" className="form-control" placeholder="**************" required autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                
                                        <div>
                                            <div className="d-grid">
                                                {isLoading === true ? (
                                                    <button disabled className="btn btn-primary">
                                                        صبرکنید <i className="fas fa-spinner fa-spin"></i>
                                                    </button>
                                                ) : (
                                                    <button type="submit" className="btn btn-primary">
                                                        ذخیره رمز <i className="fas fa-check-circle"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CreatePassword;