import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";

function Profile() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        image: null,
        first_name: "",
        last_name: "",
        about: "",
        bio: "",
        email: "",
    })
    const [imagePreview, setImagePreview] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isValidImage, setIsValidImage] = useState(true);
    const [imageError, setImageError] = useState("");
    const user_id = useUserData()?.user_id

    const fetchProfile = async () => {
        try {
            const response = await apiInstance.get(`user/profile/${user_id}/`);
            const fullName = response.data.full_name || "";
            const nameParts = fullName.split(" ");
            const firstName = nameParts.shift() || "";
            const lastName = nameParts.join(" ") || "";
            setProfileData({
                ...response.data,
                first_name: firstName,
                last_name: lastName,
                email: response.data.email || "",
            })           
        } catch (error) {
            console.log(error);            
        }
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            // Validate format here
            const validFormat = selectedFile.type === "image/jpeg" || selectedFile.type === "image/png";
            if (!validFormat) {
                setIsValidImage(false);
                setImageError("عکس باید یکی از دوفرمت jpg یا png باشد.");
                setProfileData({
                    ...profileData,
                    image: null
                });
                setImagePreview("");
                return;
            } else {
                setIsValidImage(true);
                setImageError("");
            }
            setProfileData({
                ...profileData,
                [event.target.name]: selectedFile
            })
            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    // Validate image size only
    useEffect(() => {
        const validateImageSize = () => {
            let url = imagePreview ? imagePreview : profileData.image;
            if (!url) {
                setIsValidImage(true);
                setImageError("");
                return;
            }
            // Check size by loading image
            const img = new Image();
            img.onload = () => {
                if (img.naturalWidth > 800) {
                    setIsValidImage(false);
                    setImageError("طول عکس بزرگتر از 800 پیکسل نباشد.");
                } else {
                    setIsValidImage(true);
                    setImageError("");
                }
            };
            img.onerror = () => {
                setIsValidImage(false);
                setImageError("خطا در بارگذاری عکس.");
            };
            img.src = url;
        };
        validateImageSize();
    }, [imagePreview, profileData.image]);

    const handleFormSubmit = async () => {
        if (!isValidImage) {
            Toast("error", imageError || "عکس نامعتبر است.");
            return;
        }
        setIsLoading(true);
        const res = await apiInstance.get(`user/profile/${user_id}/`)
        const formdata = new FormData()
        if (profileData.image && profileData.image !== res.data.image){
            formdata.append("image", profileData.image)
        }
        const combinedFullName = `${profileData.first_name}${profileData.last_name ? " " + profileData.last_name : ""}`;
        formdata.append("full_name", combinedFullName)
        formdata.append("about", profileData.about)
        formdata.append("bio", profileData.bio)
        formdata.append("email", profileData.email)

        try {
            const res = await apiInstance.patch(`user/profile/${user_id}/`, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            Toast("success", "پروفایل شما بروزرسانی شد")
            navigate("/")
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleProfileChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        })
    }
    useEffect(() => {
        async function fetchData() {
            await fetchProfile();
        }
        fetchData();
    }, [])
    
    return (
        <>
            <section className="pt-5 pb-5" dir="rtl">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0">مشخصات پروفایل</h3>
                                </div>
                                <div className="card-body">
                                    <div className="d-lg-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center mb-4 mb-lg-0">
                                            {(() => {
                                                const validImage = (url) => typeof url === "string" && url.trim() !== "" && url !== "http://127.0.0.1:8000/media/default/default-user.jpg";
                                                const imgSrc = imagePreview ? imagePreview : (validImage(profileData.image) ? profileData.image : "/DjangonReact/K.webp");
                                                if (!isValidImage) {
                                                    return (
                                                        <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#f8d7da", color: "#721c24", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "5px", fontSize: "12px" }}>
                                                            {imageError}
                                                        </div>
                                                    );
                                                }
                                                return <img src={imgSrc} id="img-uploaded" className="avatar-xl rounded-circle" alt="avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />;
                                            })()}
                                            <div className="me-3">
                                                <h4 className="mb-0">عکس پروفایل</h4>
                                                <input type="file" className="form-control mt-3" name="image" onChange={handleFileChange} id="" />
                                            </div>
                                            <div className="mt-3 me-5 d-flex flex-column">
                                                <label htmlFor="email" className="mb-1 fw-bold">ایمیل</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="ایمیل خود را وارد کنید"
                                                    value={profileData.email || ""}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-5" />
                                    <div>
                                        <h4 className="mb-0 fw-bold">
                                            <i className="fas fa-user-gear ms-2"></i>اطلاعات شخصی
                                        </h4>
                                        <p className="mb-4 mt-2">اطلاعات خود را اینجا ویرایش کنید</p>
                                        <div className="row gx-3">
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="fname">
                                                    نام
                                                </label>
                                                <input onChange={handleProfileChange} name="first_name" type="text" id="fname" className="form-control" placeholder="نام" required="" value={profileData.first_name || ""}/>
                                                <div className="invalid-feedback">نام خود را بنویسید.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="lname">
                                                    نام خانوادگی
                                                </label>
                                                <input onChange={handleProfileChange} name="last_name" type="text" id="lname" className="form-control" placeholder="نام خانوادگی" required="" value={profileData.last_name || ""}/>
                                                <div className="invalid-feedback">نام خانوادگی خود را بنویسید.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    حوزه فعالیت
                                                </label>
                                                <input onChange={handleProfileChange} name="bio" type="text" id="fname" className="form-control" placeholder="در چه زمینه‌ای فعالیت می‌کنید؟" required="" value={profileData.bio || ""}/>
                                                <div className="invalid-feedback">نام خود را بنویسید.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="lname">
                                                    توضیحات
                                                </label>
                                                <textarea onChange={handleProfileChange} name="about" placeholder="بیشتر درباره خودتان توضیح دهید..." id="" cols="30" rows="5" className="form-control"  value={profileData.about || ""}></textarea>
                                                <div className="invalid-feedback">نام خانوادگی خود را بنویسید.</div>
                                            </div>
                                            <div className="col-12 mt-4">
                                                {isLoading === true ? (
                                                    <button disabled className="btn btn-lg btn-secondary w-100 mt-2" type="button">
                                                        درحال بروزرسانی <i className="fas fa-spinner fa-spin"></i>
                                                    </button>
                                                ) : (
                                                    <button onClick={handleFormSubmit} className="btn btn-primary" type="button">
                                                        بروزرسانی پروفایل <i className="fas fa-check-circle"></i>
                                                    </button>
                                                )}
                                            </div>
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

export default Profile;
