import React, { useEffect, useState } from "react";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";

// Assuming Bootstrap JS is globally available as 'bootstrap'
function Comments() {
    const [comments, setComment] = useState([])
    const [reply, setReply] = useState({}) // changed to object to hold reply per comment
    const [seenComments, setSeenComments] = useState({}) // track seen comments by id
    const [repliedContactMessages, setRepliedContactMessages] = useState({}) // track replied contact messages by id
    const userData = useUserData()
    const user_id = userData?.user_id
    const canDeleteComment = userData?.is_staff || userData?.can_delete_comment || false

    const fetchComments = async () => {
        const comment_res = await apiInstance.get(`author/dashboard/comment-list/${user_id}/`)
        const contact_res = await apiInstance.get(`contact-message/list/`)
        // Combine comments and contact messages
        const allComments = [...comment_res?.data, ...contact_res?.data]
        // Sort comments by date descending (newest first)
        const sortedComments = allComments?.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
        setComment(sortedComments)
    }

    const handleReplyChange = (commentId, value) => {
        setReply(prev => ({ ...prev, [commentId]: value }))
    }

    const handleSubmitReply = async (commentId) => {
        try {
            const comment = comments.find(c => c.id === commentId);
            let response;
            if (comment?.message) {
                // Send reply to contact message using backend contact-message/reply/ endpoint
                response = await apiInstance.post(`contact-message/reply/`, {
                    contact_message_id: comment.id,
                    response: reply[commentId] || "",
                })
            setRepliedContactMessages(prev => ({ ...prev, [commentId]: true })) // mark as replied immediately
        } else {
            // Reply logic for normal comments
            response = await apiInstance.post(`author/dashboard/reply-comment/`, {
                comment_id: commentId,
                reply: reply[commentId] || "",
            })
        }
        console.log(response.data); 
        await fetchComments()
        // Dispatch event to notify header about update
        window.dispatchEvent(new CustomEvent('contactMessagesUpdated'));
        Toast("success", "پاسخ فرستاده شد")
        setReply(prev => ({ ...prev, [commentId]: "" })) // clear reply for this comment

        // Close the collapse div programmatically
        const collapseElement = document.getElementById(`collapseExample${commentId}`)
        if (collapseElement) {
            // eslint-disable-next-line no-undef
            const bsCollapse = window.bootstrap?.Collapse.getInstance(collapseElement) || new window.bootstrap.Collapse(collapseElement)
            bsCollapse.hide()
        }
    } catch (error) {
        console.log(error);
    }
    }

    // New handler to mark comment as seen when button is clicked
    const handleMarkSeen = (commentId) => {
        setSeenComments(prev => {
            if (prev[commentId]) return prev; // already seen
            return { ...prev, [commentId]: true };
        });
    };

    // New handler to delete comment or contact message
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟")) return;
        try {
            // Find the comment/contact message by id
            const comment = comments.find(c => c.id === commentId);
            if (!comment) {
                Toast("error", "نظر یافت نشد");
                return;
            }
            if (comment.message) {
                // It's a contact message, call delete-contact-message endpoint
                await apiInstance.post(`author/dashboard/delete-contact-message/`, {
                    contact_message_id: commentId,
                });
                Toast("success", "پیام تماس با موفقیت حذف شد");
            } else {
                // It's a comment, call delete-comment endpoint
                await apiInstance.post(`author/dashboard/delete-comment/`, {
                    comment_id: commentId,
                });
                Toast("success", "نظر با موفقیت حذف شد");
            }
            await fetchComments();
            // Dispatch custom event to notify other components (e.g., Dashboard) about deletion
            window.dispatchEvent(new CustomEvent('commentDeleted', { detail: { commentId, isContactMessage: !!comment.message } }));
        } catch (error) {
            console.error(error);
            Toast("error", "حذف نظر با شکست مواجه شد");
        }
    };

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <>
            <section className="pt-5 pb-5" style={{ direction: "rtl" }}>
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            {/* Card */}
                            <div className="card mb-4">
                                {/* Card header */}
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">بخش نظرات</h3>
                                    </div>
                                </div>
                                {/* Card body */}
                                <div className="card-body">
                                    {/* List group */}
                                    <ul className="list-group list-group-flush">
                                        {/* List group item */}
                                        {comments?.map((c, index) => (                                     
                                            <li 
                                                key={c.id} 
                                                className="list-group-item p-4 shadow rounded-3 mb-4"
                                                style={{ 
                                                    fontWeight: (seenComments[c.id] || c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "normal" : "bold",
                                                    backgroundColor: (seenComments[c.id] || c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "#e3e3e3" : "transparent"
                                                }}
                                            >
                                                <div className="d-flex">
                                                    <img src={c?.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="avatar" className="rounded-circle avatar-lg" style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }} />
                                                    <div style={{ marginRight: "1rem", marginTop: "0.5rem" }} >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h4 className="mb-2">از طرف {c?.name} </h4>
                                                                <span>{Moment(c.date)} ({c?.email})</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            {c?.subject && (
                                                                <p className="mt-1" style={{ fontWeight: (seenComments[c.id] || c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "normal" : "bold", color: "#555" }}>
                                                                    موضوع: {c.subject} {c?.message && <span className="badge bg-warning text-dark ms-2 me-1">پیام تماس</span>}
                                                                </p>
                                                            )}
                                                            <p className="mt-2" style={{ fontWeight: (seenComments[c.id] || c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "normal" : "bold" }}>
                                                                <span style={{ marginLeft: "0.5rem" }}>
                                                                    {c?.message ? "پیام:" : "نظر:"} 
                                                                </span>
                                                                {c?.comment || c?.message}              
                                                            </p>
                                                            {c?.post && !c?.message && (
                                                                <p className="mt-1" style={{ fontWeight: (seenComments[c.id] || c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "normal" : "bold", color: "#555" }}>
                                                                    <i className="bi bi-file-earmark-text me-1"></i>
                                                                    در پست: 
                                                                    <a href={`/post/${c?.post?.slug}`} className="text-decoration-none text-primary ms-1" target="_blank" rel="noopener noreferrer">
                                                                        {c?.post?.title}
                                                                    </a>
                                                                </p>
                                                            )}
                                                            <hr/>
                                                            <p className="mt-2" style={{ fontWeight: (seenComments[c.id] || c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "normal" : "bold", color: (c?.message && (c?.responded || repliedContactMessages[c.id])) ? 'green' : (!c?.reply ? 'red' : 'inherit') }}>
                                                                <span style={{ marginLeft: "0.5rem", color: (c?.message && (c?.responded || repliedContactMessages[c.id])) ? 'green' : 'inherit' }}>
                                                                    پاسخ: 
                                                                </span>
                                                                {(c?.message && (c?.responded || repliedContactMessages[c.id])) ? 'پیام ارسال شد' : (c?.reply || 'بدون پاسخ')}
                                                            </p>
                                                            <p>
                                                                {!(c?.message && (c?.responded || repliedContactMessages[c.id])) && (
                                                                    <button 
                                                                        className={(c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "btn btn-secondary" : "btn btn-outline-secondary"} 
                                                                        type="button" 
                                                                        data-bs-toggle="collapse" 
                                                                        data-bs-target={`#collapseExample${c.id.toString()}`} 
                                                                        aria-expanded="false" 
                                                                        aria-controls={`collapseExample${c.id.toString()}`}
                                                                        onClick={() => handleMarkSeen(c.id)}
                                                                        style={{marginLeft: ".5rem"}}
                                                                    >
                                                                        {c?.reply ? "ویرایش پاسخ" : "پاسخ دهید"}
                                                                    </button>
                                                                )}
                                                                {canDeleteComment && (
                                                                    <button
                                                                        className={(c?.reply || (c?.message && (c?.responded || repliedContactMessages[c.id]))) ? "btn btn-danger" : "btn btn-outline-danger"} 
                                                                        onClick={() => handleDeleteComment(c.id)}
                                                                    >
                                                                        حذف نظر
                                                                    </button>
                                                                )}
                                                            </p>
                                                            <div className="collapse" id={`collapseExample${c.id.toString()}`}>
                                                                <div className="card card-body">
                                                                    <div>
                                                                        <div className="mb-3">
                                                                            <label htmlFor={`replyTextarea${c.id}`} className="form-label">
                                                                                پاسخ خود را بنویسید
                                                                            </label>
                                                                            <textarea onChange={(e) => handleReplyChange(c.id, e.target.value)} value={reply[c.id] || ""} name="" id={`replyTextarea${c.id}`} cols="30" className="form-control" rows="4"></textarea>
                                                                        </div>

                                                                        <button onClick={() => handleSubmitReply(c.id)} type="button" className="btn btn-primary">
                                                                            ارسال <i className="fas fa-paper-plane"> </i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
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

export default Comments;

