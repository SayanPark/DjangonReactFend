import React, { useEffect } from "react";
import Toast from "../../plugin/Toast";
import Picture from "../../../public/muslim-7747744_1920.webp";

const UnsubscribeSuccess = () => {
  useEffect(() => {
    Toast("success", "شما با موفقیت از دریافت به‌روزرسانی‌ها لغو اشتراک کردید.");
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <img src={Picture} alt="Unsubscribe Success" style={{ maxWidth: "20%", height: "auto", marginBottom: "1rem" }} />
      <h2>لغو اشتراک با موفقیت انجام شد.</h2>
      <p>از اینکه با ما بودید سپاسگزاریم.</p>
    </div>
  );
};

export default UnsubscribeSuccess;
