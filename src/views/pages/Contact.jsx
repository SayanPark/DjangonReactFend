import React, { useState } from "react";
import apiInstance from "../../utils/axios";

function Contact() {
    const [activeAddress, setActiveAddress] = useState("central");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const centralMapSrc = "https://www.google.com/maps/embed?pb=!1m21!1m12!1m3!1d809.3841535918051!2d51.33388502456312!3d35.762192699999986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m0!4m3!3m2!1d35.76210890557285!2d51.3346870050676!5e0!3m2!1sen!2s!4v1756153838856!5m2!1sen!2s";
    const storeMapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.411670361182!2d51.30427047491373!3d35.76526272535482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8dfd0078e6fcc1%3A0xf7d41c82be8b3b2b!2z2LTZh9ixINiy2YbYp9mGINqp2KfYsdii2YHYsduM2YY!5e0!3m2!1sen!2s!4v1752094605687!5m2!1sen!2s";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await apiInstance.post("/contact-message/create/", formData);

            if (response.status === 201) {
                setSuccessMessage("پیام شما با موفقیت ارسال شد. به زودی پاسخ داده خواهد شد.");
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            } else {
                setErrorMessage(response.data.message || "خطایی در ارسال پیام رخ داد.");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            setErrorMessage(error.response?.data?.message || "خطایی در ارسال پیام رخ داد.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 mx-auto text-center">
                            <h1 className="fw-bold">با ما در ارتباط باشید</h1>
                        </div>
                    </div>
                </div>
            </section>
            {/* ======================= Inner intro END */}
            {/* ======================= Contact info START */}
            <section className="pt-4" >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md mb-5">
                            <div className="btn-group mb-4 d-flex justify-content-center" role="group" aria-label="Address toggle">
                                <button
                                            type="button"
                                            className={`btn btn-outline-primary ${activeAddress === "central" ? "active" : ""}`}
                                            onClick={() => setActiveAddress("central")}
                                        >
                                            آدرس دفتر مرکزی
                                </button>
                                <button
                                            type="button"
                                            className={`btn btn-outline-primary ${activeAddress === "store" ? "active" : ""}`}
                                            onClick={() => setActiveAddress("store")}
                                        >
                                            آدرس فروشگاه
                                </button>
                            </div>
                            {activeAddress === "central" && (
                                <iframe
                                    src={centralMapSrc}
                                    style={{ width: "100%", height: "400px", border: 0, borderRadius: 30 }}
                                    aria-hidden="false"
                                    tabIndex={0}
                                    title="Central Office Address"
                                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                />
                            )}
                            {activeAddress === "store" && (
                                <iframe
                                    src={storeMapSrc}
                                    style={{ width: "100%", height: "400px", border: 0, borderRadius: 30 }}
                                    aria-hidden="false"
                                    tabIndex={0}
                                    title="Store Address"
                                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                />
                            )}
                        </div>
                        <div className="col-12 col-md" style={{direction: "rtl", textAlign: "right"}}>
                            <div className="col">
                                <h3 className="mb-4">آدرس شهرزنان</h3>
                                <div>
                                    <strong>دفتر مرکزی:</strong>
                                    <address className="text-reset">
                                        تهران، پونک، عدل شمالی، خیابان اردیبهشت،
                                        نبش کوچه اول، پلاک دو، واحد دو و چهار
                                    </address>
                                </div>
                                <div>
                                    <strong>فروشگاه:</strong>
                                    <address className="text-reset">
                                        تهران، جنت آباد مرکزی، آبشناسان، خیابان رجب صلاحی،
                                        بعد از نیایش مال، بازاربزرگ جنت، پلاک ۵۴
                                    </address>
                                </div>
                                <br/>               
                                <h3 className="mb-4">اطلاعات تماس</h3>
                                <p>
                                    شماره تماس:{" "}
                                    <a className="text-reset">
                                        <span style={{direction: "ltr", display: "inline-block"}}>
                                            ۰۲۱-۴۴۴۲۰۹۴۵ | ۰۹۱۲۹۳۷۴۰۴۸
                                        </span>
                                    </a>
                                </p>
                                <p>
                                    اینستاگرام:{" "}
                                    <a href="https://instagram.com/shahrzanan" className="text-reset">
                                        <span style={{direction: "ltr", display: "inline-block"}}>@shahrzanan</span>
                                    </a>
                                </p>
                                <p>
                                    زمان پاسخ‌دهی: شنبه تا چهارشنبه
                                    <br />
                                    از 9 صبح تا 6 بعدازظهر
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-5" style={{direction: "rtl", textAlign: "right"}}>
                        <hr className="my-4" />
                        <div className="col-12">
                            <h2 className="fw-bold">به ما پبام دهید</h2>
                            <p> لطفا این فرم را پر کنید تا ما در اسرع وقت پاسخ‌گوی شما باشیم (ایمیل شما منتشر نخواهد شد) </p>
                            
                            {/* Success/Error Messages */}
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            
                            {/* Form START */}
                            <form className="contact-form" id="contact-form" name="contactform" method="POST" onSubmit={handleSubmit}>
                                {/* Main form */}
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* name */}
                                        <div className="mb-3">
                                        <label className="con-label mb-1">نام خود را بنویسید</label>
                                            <input 
                                                required 
                                                id="con-name" 
                                                name="name" 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="نام خود را بنویسید" 
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* email */} 
                                        <div className="mb-3">
                                        <label className="con-label mb-1">ایمیل</label>
                                            <input 
                                                required 
                                                id="con-email" 
                                                name="email" 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="ایمیل" 
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        {/* Subject */}
                                        <div className="mb-3">
                                            <label className="con-label mb-1">عنوان</label>
                                            <input 
                                                required 
                                                id="con-subject" 
                                                name="subject" 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="موضوع" 
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        {/* Message */}
                                        <div className="mb-3">
                                            <textarea 
                                                required 
                                                id="con-message" 
                                                name="message" 
                                                cols={40} 
                                                rows={6} 
                                                className="form-control" 
                                                placeholder="انتقاد یا پیشنهادات خود را بنویسید" 
                                                value={formData.message}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    {/* submit button */}
                                    <div className="col-md-12 text-start">
                                        <button 
                                            className="btn btn-primary w-100" 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? "در حال ارسال..." : "ارسال کنید"} <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            {/* Form END */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Contact;
