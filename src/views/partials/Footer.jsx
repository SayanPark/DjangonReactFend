import React from "react";
import image from "../../../public/LogoLandrl.webp";

function Footer() {
    return (
        <>
        <footer>
            <div>
                <div
                    style={{
                        cursor: 'pointer',
                        color: 'white',
                        width: '100%',
                        padding: '10px 0',
                        backgroundColor: '#609f63',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: '1.5',
                        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                        userSelect: 'none',
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="بازگشت به بالا"
                    >
                    بازگشت به بالا
                </div>
            </div>
            <div className="row py-4 mx-0 justify-content-between align-items-center text-center text-md-start" style={{ backgroundColor: '#887298', borderRadius: 0, border: 'none' }}>
                <div className="col-12 col-md-3 mb-3 mb-md-0 text-center text-md-right" style={{direction: "rtl", textAlign: "right"}} >
                    <img src={image} style={{ maxWidth: "100%", height: "auto" }} alt="footer logo" />
                    <br/> <br/>
                    <small className="text-primary-hover text-white fs-9" style={{ fontSize: '0.6rem' }}>
                        کلیه حقوق قانونی وبسایت متعلق به شهرزنان کارآفرین می‌باشد
                    </small>
                </div>
                <div className="col-12 col-md-4 d-flex flex-column align-items-center align-items-md-end text-center text-md-end">
                    <ul className="nav flex-column flex-md-row text-primary-hover justify-content-center justify-content-md-end">
                        <li className="nav-item mb-2 mb-md-0">
                            <a className="nav-link text-white px-2 fs-8" href="https://instagram.com/shahrzanan" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem' }}>
                                @shahrzanan <i className="bi bi-instagram" /> 
                            </a>
                            <small className="nav-link text-white px-2 fs-8" style={{ fontSize: '0.8rem' }}>
                                ۰۲۱-۴۴۴۲۰۹۴۵ | ۰۹۱۲۹۳۷۴۰۴۸ <i className="bi bi-telephone" /> 
                            </small>
                            <p className="nav-link text-white px-2 fs-6" style={{ marginBottom: '0.2rem' }}>                                
                                <span style={{ fontSize: '0.8rem' }}>
                                    تهران، پونک، عدل شمالی، خیابان اردیبهشت
                                </span> <i className="bi bi-geo-alt-fill"/>
                                <br/>
                                <span style={{ fontSize: '0.8rem' }}>
                                    نبش کوچه اول، پلاک دو، واحد دو و چهار
                                </span>
                            </p>
                            <p className="nav-link text-white px-2 fs-6" style={{ marginBottom: '0.2rem' }}>                                
                                <span style={{ fontSize: '0.8rem' }}>
                                    تهران، جنت آباد مرکزی، آبشناسان، خیابان رجب صلاحی 
                                </span> <i className="bi bi-shop"/>
                                <br/>
                                <span style={{ fontSize: '0.8rem' }}>
                                    بعد از نیایش مال، بازاربزرگ جنت، پلاک ۵۴
                                </span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
        </>
    );
}

export default Footer;
