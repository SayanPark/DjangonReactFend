import React, { useEffect, useState } from "react";
import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";

function Notifications() {
    const [noti, setNoti] = useState([])
    const userData = useUserData();
    const user_id = userData?.user_id

    const fetchNoti = async () => {
        try {
            if (!user_id) return;
            const noti_res = await apiInstance.get(`author/dashboard/noti-list/${user_id}/`)
            setNoti(noti_res?.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleMarkNotiAsSeen = async (notiId) => {
        try {
            const response = await apiInstance.post(`author/dashboard/noti-mark-seen/`, {noti_id: notiId})
            console.log(response.data);
            fetchNoti()
            Toast("success", "نوتیفیکشن دیده شد")
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Toast("error", "شما اجازه دسترسی ندارید. لطفا وارد شوید.")
            } else {
                Toast("error", "خطا در علامت گذاری نوتیفیکیشن به عنوان دیده شده")
            }
        }
    }

    useEffect(() => {
        fetchNoti()
    }, [user_id])


    return (
        <>
            <section className="pt-5 pb-5" dir="rtl">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card mb-4">
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0 text-end">
                                        <h3 className="mb-0">اعلانات</h3>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush" style={{paddingRight: 0}}>
                                        {noti?.length > 0 ? (
                                            noti.map((n, index) => (
                                                <li key={n.id} className="list-group-item p-4 shadow rounded-3 mt-4">
                                                    <div className="d-flex">
                                                        <div className="me-3 mt-2">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <div className="mb-0">
                                                                        {n.type === "Like" && (
                                                                            <>
                                                                                <h4>
                                                                                    <i className="fa fa-heart text-danger fs-5"></i> لایک جدید
                                                                                </h4>
                                                                                <p className="mt-3">
                                                                                    یک نفر پست شمارا لایک کرد. <b>{n?.post?.title}</b>
                                                                                </p>
                                                                            </>
                                                                        )}
                                                                        {n.type === "Comment" && (
                                                                            <>
                                                                                <h4>
                                                                                    <i className="bi bi-chat-left-quote-fill text-success fs-5"></i> نظر جدید
                                                                                </h4>
                                                                                <p className="mt-3">
                                                                                    یک نفر برای پست شما نظر گذاشت. <b>{n?.post?.title}</b>
                                                                                </p>
                                                                            </>
                                                                        )}
                                                                        {n.type === "Bookmark" && (
                                                                            <>
                                                                                <h4>
                                                                                    <i className="fa fa-bookmark text-primary fs-5"></i> ذخیره‌ جدید
                                                                                </h4>
                                                                                <p className="mt-3">
                                                                                    یک نفر پست شمارا ذخیره‌ کرد. <b>{n?.post?.title}</b>
                                                                                </p>
                                                                            </>
                                                                        )}
                                                                        {n.type === "ContactMessage" && (
                                                                            <>
                                                                                <h4>
                                                                                    <i className="fa fa-envelope text-warning fs-5"></i> پیام جدید از کاربر
                                                                                </h4>
                                                                                <p className="mt-3">
                                                                                    یک پیام جدید از کاربر دریافت کردید. لطفا پاسخ دهید.
                                                                                </p>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="mt-1">
                                                                    <span className="ms-2 fw-bold">
                                                                        تاریخ: <span className="fw-light">{Moment(n?.date)}</span>
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <button onClick={() => handleMarkNotiAsSeen(n?.id)} className="btn btn-outline-secondary" type="button">
                                                                        Mark as Seen <i className="fas fa-check"></i>
                                                                    </button>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="d-flex align-items-center justify-content-center">هیچ اعلان جدیدی نیست.</p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Notifications;
