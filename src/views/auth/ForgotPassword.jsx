import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async () => {
        try {
            setIsLoading(true);
            await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
                setEmail("");
                Swal.fire({
                    icon: "success",
                    title: "ایمیل با موفقیت فرستاده شد",
                    text: " ایمیل خود را چک کنید inbox یا spam لطفا بخش ",
                }).then(() => {
                    setIsLoading(false);
                    navigate("/");
                });
            });
        } catch (error) {
            console.log();
            setIsLoading(false);
        }
    };

    return (
        <>
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" , direction: "rtl" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">فراموشی رمز</h1>
                                </div>
                                <div className="needs-validation">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            لطفا ایمیل خود را وارد کنید
                                        </label>
                                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id="email" className="form-control" name="email" placeholder="آدرس ایمیل" required="" />
                                    </div>

                                    <div>
                                        <div className="d-grid">
                                            {isLoading === true ? (
                                                <button disabled className="btn btn-primary">
                                                    صبرکنید <i className="fas fa-spinner fa-spin"></i>
                                                </button>
                                            ) : (
                                                <button onClick={handleEmailSubmit} className="btn btn-primary">
                                                    ارسال ایمیل
                                                </button>
                                            )}
                                        </div>
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

export default ForgotPassword;
