import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";

// Custom arrow components for slider navigation
const arrowStyleOverrides = `
  .slick-arrow.slick-next::before,
  .slick-arrow.slick-prev::before {
    display: none !important;
  }
`;
function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <>
            <style>{arrowStyleOverrides}</style>
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    right: 0,
                    zIndex: 1,
                    width: "60px",
                    height: "120px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderTopLeftRadius: "60px",
                    borderBottomLeftRadius: "60px",
                    cursor: "pointer",
                    color: "rgba(50, 142, 110, 0.4)",
                    fontSize: "80px",
                    fontWeight: "bold",
                    userSelect: "none",
                }}
                onClick={onClick}
            >
                <span style={{ display: "inline-block", transform: "translateY(-5px)"}}>{'>'}</span>
            </div>
        </>
    )
}
function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <>
            <style>{arrowStyleOverrides}</style>
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    left: 0,
                    zIndex: 1,
                    width: "60px",
                    height: "120px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderTopRightRadius: "60px",
                    borderBottomRightRadius: "60px",
                    cursor: "pointer",
                    color: "rgba(50, 142, 110, 0.4)",
                    fontSize: "80px",
                    fontWeight: "bold",
                    userSelect: "none",
                }}
                onClick={onClick}
            >
                <span style={{ display: "inline-block", transform: "translateY(-5px)"}}>{'<'}</span>
            </div>
        </>
    );
}

function About() {
    const [profileData, setProfileData] = useState({image: null, full_name: "", about: "", bio: ""})
    const [usersData, setUsersData] = useState([])
    const user_id = useUserData()?.user_id
    const [sliderSettings] = useState({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
        {
            breakpoint: 992,
            settings: {
            slidesToShow: 3
            }
        },
        {
            breakpoint: 768,
            settings: {
            slidesToShow: 2
            }
        },
        {
            breakpoint: 576,
            settings: {
            slidesToShow: 2
            }
        }
        ]
    });

    const fetchProfile = async () => {
        if (!user_id) {
            console.warn("User ID is undefined. Skipping fetchProfile API call.");
            return;
        }
        try {
            const response = await apiInstance.get(`user/profile/${user_id}/`);
            setProfileData(response.data)
            console.log(response.data);            
        } catch (error) {
            console.error("Error fetching profile:", error);            
        }
    }
    const fetchUsers = async () => {
        try {
            const response = await apiInstance.get('user/all/');
            setUsersData(response.data);
            console.log("Users data:", response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }
    useEffect(() => {
        async function fetchData() {
            await fetchProfile();
            await fetchUsers();
        }
        fetchData();
    }, [user_id])
    console.log(profileData)

    return (
        <>
            <section className="pt-4 pb-0">
                <div className="container" style={{ direction: "rtl" }}>
                    <div className="row">
                        <div className="col-xl-9 mx-auto">
                            <h2 className="pt-2 pb-2">سخن اول موسس شهرزنان</h2>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <video className="pt-4 pb-5" controls controlsList="nodownload" style={{ width: "100%" }} onContextMenu={(e) => e.preventDefault()}>
                                    <source src="/video_2025-06-12_14-20-37.mp4" type="video/mp4" />
                                    مرورگر شما از ویدئو پشتیبانی نمی‌کند، مجددا تلاش کنید
                                </video>
                            </div>
                            <h2>داستان ما</h2>
                            <br />
                            <p className="lead">
                                شرکت شهرزنان کارآفرین با هدف توانمندسازی زنان، ایجاد فرصتهای شغلی برابر و رشد اقتصادی پایدار در جامعه اسفند ۱۴۰۳ تاسیس شد.                        
                            </p>
                            <p>
                                گروه شهرِزنانِ کارآفرین با هدف شناسایی و ارتقا پتانسیل‌های اقتصادی زنان کارآفرین تشکیل شده‌است. این مرکز با برنامه‌های گسترده‌ای که در مسیر توسعه روابط تجاری زنان کارآفرین کشور دارد، بسترساز ارتقا سطح تعاملات بین شرکت‌ها و فعالیت‌های اقتصادی خواهد بود.
                            </p>
                            <p>
                                این گروه بعنوان کانون ارتباط تجاری با ارائه خدمات ویژه به شرکت‌ها و تجار، نقش پشتیبانی و
                                تسهیلگری را دارد. به گونه‌ای که در تمامی فرآیندهای تجاری در کنار زنان کارآفرین خواهد بود. 
                            </p>
                            <p>
                                ما در شهرزنان، به آینده‌ای روشن برای زنان کارآفرین ایران باور داریم و می‌خواهیم با شکوفایی استعدادها و توانایی‌های زنان ایران را به قطب کارآفرینی زنان در منطقه تبدیل کنیم.                                   
                            </p>
                            <br />
                            <h3 className="mt-2 mb-4">اهداف و حوزه‌های فعالیت مرکز :</h3>
                            <p className="mb-3">
                                اهداف و حوزه‌های فعالیت این
                                مرکز تجاری با ایجاد واحد‌های ویژه و تخصصی در حوزه‌های مختلف کالایی از جمله صنایع غذایی، صنایع دستی، کشاورزی و
                                باغداری، سلامت ، صنعت و..... خدمات ویژه‌ای را برای ورود به بازار ایران و سایر کشورها و همچنین تامین نیازهای خود از سایر
                                کشورها ارائه می‌کند.
                            </p>
                            <br />
                            <ul >
                                <li className="mb-3">
                                    خدمات ویژه کسب و کار، خدمات بازرگانی، مالی و بانکی، خدمات نمایشگاهی و برگزاری رویدادها در ایران و کشورهای
                                    مختلف از طریق میزبانی یا اعزام زنان فعال اقتصادی در مسیر توسعه روابط تجاری در کنار شما خواهد بود.
                                </li>
                                <li className="mb-3">
                                    شناسایی زنان فعال کارآفرین، بررسی نوع محصول و ظرفیت تولید، مشاوره تجاری، تحقیق بازار، بازاریابی و تنازلیابی،
                                    استانداردسازی محصول، مشاوره مالی، جذب سرمایه‌گذار برای شرکت‌های فعال، در واحدهای مختلف این مرکز با همکاری
                                    کارشناسان زبده ارائه می گردد.
                                </li>
                                <li className="mb-3">
                                    این مرکز میزبان شرکت‌ها و زنان کارآفرین فعال اقتصادی در داخل و خارج از کشور بوده و امکانات ویژه‌ای از جمله ارائه
                                    دفاتر کار اشتراکی، میز کار اختصاصی، تخصیص فضا در شوروم دائمی محصولات، و .... را در اختیار متقاضیان محترم قرار می‌دهد.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
           
            <section className="bg-light mt-5" >
                <div className="bg-light pb-5">
                    <h3 className="mb-3 pt-5 me-5 bg-light" style={{direction: "rtl"}}>شهروندان شهرزنان کارآفرین</h3>
                    <div>
                        {usersData && usersData.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {usersData.map((user) => (
                                    <div key={user.id} className="text-center px-1">
                                        <div className="avatar avatar-xxl mb-2">
                                            {(() => {
                                                const imgSrc = user.image && user.image.trim() !== "" && !user.image.includes("default-user") ? user.image : "/K.webp";
                                                return (
                                                    <Link to={`/author-profile/${user.id}`}>
                                                        <img
                                                            className="avatar-img rounded-circle"
                                                            style={{ width: "100px", height: "100px", objectFit: "cover", margin: "0 auto", display: "block" }}
                                                            src={imgSrc}
                                                            alt="avatar"
                                                        />
                                                    </Link>
                                                );
                                            })()}
                                        </div>
                                        <h5>{user.full_name}</h5>
                                        <p className="m-0">{user.bio || user.about || "هیچ متنی یافت نشد"}</p>
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p>درحال بازگذاری شهروندان...</p>
                        )}
                    </div>
                </div>{" "}
            </section>
        </>
    );
}

export default About;
