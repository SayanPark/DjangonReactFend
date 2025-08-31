import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";
import { Editor, EditorState, convertFromRaw, CompositeDecorator, ContentState } from "draft-js";

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

const DraftLink = (props) => {
  let { url } = props.contentState.getEntity(props.entityKey).getData();

  // Normalize URL to ensure it is absolute
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const handleClick = (e) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={url}
      style={{ color: "blue", textDecoration: "underline" }}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: DraftLink,
  },
]);

function mediaBlockRenderer(block) {
  if (block.getType() === "atomic") {
    return {
      component: MediaBlock,
      editable: false,
    };
  }
  return null;
}

function MediaBlock(props) {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src, type } = entity.getData();

  let media;
  if (type === "image") {
    media = <img src={src} alt="" style={{ maxWidth: "50%" }} />;
  } else if (type === "video") {
    media = (
      <video controls style={{ maxWidth: "50%" }}>
        <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
      </video>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
      {media}
    </div>
  );
}

function Detail() {
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState([]);
  const param = useParams();

  const [createComment, setCreateComment] = useState({
    full_name: "",
    email: "",
    comment: "",
  });
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );
  const [comments, setComments] = useState([]);

  const customStyleMap = {
    'FONT_SIZE_12': { fontSize: '12px' },
    'FONT_SIZE_14': { fontSize: '14px' },
    'FONT_SIZE_16': { fontSize: '16px' },
    'FONT_SIZE_18': { fontSize: '18px' },
    'FONT_SIZE_20': { fontSize: '20px' },
    'BOLD': { fontWeight: 'bold' },
    'ITALIC': { fontStyle: 'italic' },
  };

  const fetchPost = async () => {
    console.log("Fetching post with slug:", param.slug);
    try {
      const url = `post/detail/${param.slug}/`;
      console.log("API URL:", url);
      const response = await apiInstance.get(url);
      setPost(response.data);

      const tagArray = response?.data?.tags?.split(",");
      setTags(tagArray);

      if (response.data.description) {
        try {
          let contentState;
          if (typeof response.data.description === "string") {
            try {
              contentState = convertFromRaw(JSON.parse(response.data.description));
            } catch {
              contentState = ContentState.createFromText(response.data.description);
            }
          } else if (typeof response.data.description === "object") {
            contentState = convertFromRaw(response.data.description);
          } else {
            contentState = ContentState.createFromText("");
          }
          setEditorState(EditorState.createWithContent(contentState, decorator));
        } catch (error) {
          // Fallback: treat description as plain text if all else fails
          setEditorState(EditorState.createEmpty(decorator));
        }
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      if (error.response?.status === 404) {
        Toast("error", "پست مورد نظر یافت نشد");
      } else {
        Toast("error", "خطا در بارگذاری پست. لطفاً دوباره تلاش کنید");
      }
    }
  };

  const fetchComments = async () => {
    if (!post?.id) return;

    try {
      console.log("Fetching comments for post ID:", post.id);
      const response = await apiInstance.get(`post/comments/${post.id}/`);
      console.log("Fetched comments with replies:", response.data);
      
      // Handle different response structures
      let commentsData = response.data;
      
      // If response is an object with nested comments array
      if (typeof commentsData === 'object' && !Array.isArray(commentsData)) {
        commentsData = commentsData.results || commentsData.comments || commentsData.data || [];
      }
      
      // If no comments from separate endpoint, fallback to post.comments
      if (!commentsData || commentsData.length === 0) {
        console.log("No comments from separate endpoint, using post.comments");
        if (post?.comments && Array.isArray(post.comments)) {
          commentsData = post.comments;
        }
      }
      
      // Ensure each comment has reply field and process the data
      const processedComments = commentsData.map(comment => ({
        id: comment.id,
        name: comment.name,
        email: comment.email,
        comment: comment.comment,
        date: comment.date,
        reply: comment.reply || comment.replies || null, // Handle both reply and replies fields
        post: comment.post
      }));
      
      console.log("Processed comments:", processedComments);
      
      // Debug: Check if any comments have replies
      const commentsWithReplies = processedComments.filter(c => c.reply);
      console.log("Comments with replies:", commentsWithReplies);
      
      setComments(processedComments);
    } catch (error) {
      console.error("Failed to fetch comments from separate endpoint:", error);
      
      // Fallback to post.comments if separate fetch fails
      if (post?.comments && Array.isArray(post.comments)) {
        console.log("Falling back to post.comments");
        const processedComments = post.comments.map(comment => ({
          id: comment.id,
          name: comment.name,
          email: comment.email,
          comment: comment.comment,
          date: comment.date,
          reply: comment.reply || comment.replies || null,
          post: comment.post
        }));
        console.log("Fallback comments:", processedComments);
        
        // Debug: Check if any fallback comments have replies
        const fallbackCommentsWithReplies = processedComments.filter(c => c.reply);
        console.log("Fallback comments with replies:", fallbackCommentsWithReplies);
        
        setComments(processedComments);
      } else {
        console.log("No comments available from any source");
        setComments([]);
      }
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (post?.id) {
      fetchComments();
    }
  }, [post?.id]);

  const handleCreateCommentChange = (event) => {
    setCreateComment({
      ...createComment,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateCommentSubmit = async (event) => {
    event.preventDefault();
    const json = {
      post_id: post?.id,
      name: createComment.full_name,
      email: createComment.email,
      comment: createComment.comment,
    };
    const response = await apiInstance.post(`post/comment-post/`, json);
    Toast("success", "فرستاده شد");
    fetchPost();
    fetchComments(); // Refresh comments to include new comment
    setCreateComment({
      full_name: "",
      email: "",
      comment: "",
    });
  };

  const handleLikePost = async () => {
    const json = {
      user_id: 1,
      post_id: post?.id,
    };
    const response = await apiInstance.post(`post/like-post/`, json);
    Toast("success", response.data.message);
    fetchPost();
  };

  const handleBookmarkPost = async () => {
    const json = {
      user_id: 1,
      post_id: post?.id,
    };
    const response = await apiInstance.post(`post/bookmark-post/`, json);
    Toast("success", response.data.message);
    fetchPost();
  };

  return (
    <>
      <section className="mt-5" style={{ direction: "rtl", textAlign: "right" }}>
        <div className="container">
          <div className="row">
          <div className="col-12">
              <Link to={post?.category?.slug ? `/category/${post.category.slug}` : "#"} className="badge bg-danger mb-2 text-decoration-none">
                <i className="small fw-bold " />
                {post?.category?.title || "بدون دسته"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0" style={{ direction: "rtl", textAlign: "right" }}>
        <div className="container position-relative" data-sticky-container="">
          <div className="row">
            <div className="col-lg-2" style={{ direction: "rtl", textAlign: "right" }}>
              <div className="text-center text-lg-center mb-5">
                <div className="position-relative">
                  <div className="avatar avatar-xl">
                    <Link to={`/author-profile/${post?.user?.id}`}>
                      <img
                        className="avatar-img"
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                        src={post?.user?.image || "/K.webp"}
                        alt="avatar"
                        onError={(e) => {
                            // If the image fails to load, fallback to default image
                            if (e.target.src !== "/K.webp") {
                                e.target.src = "/K.webp";
                            }
                        }}
                      />
                    </Link>
                  </div>
                  <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                    {post?.user?.full_name}
                  </a>
                  <p>{""}</p>
                </div>
                <hr className="d-none d-lg-block " />
                <ul className="list-inline list-unstyled justify-content-end" style={{ paddingRight: 0 }}>
                  <li className="list-inline-item d-lg-block my-lg-2 text-end ms-2" style={{ marginRight: 0 }}>
                    <i className="fas fa-calendar ms-1" />
                    {Moment(post?.date)}
                  </li>
                  <li className="list-inline-item d-lg-block my-lg-2 text-end" style={{ marginRight: 0 }}>
                    <a href="#" className="text-body ">
                      <i className="fas fa-heart ms-1" />
                    </a>
                    {post?.likes?.length}
                    <i className="fas fa-eye ms-1 me-2" />
                    {post?.view}
                  </li>
                </ul>
                <style>
                  {`
                    .custom-btn-padding {
                      padding-left: 31px;
                      padding-right: 31px;
                    }
                    @media (max-width: 1399px) and (min-width: 992px) {
                      .custom-btn-padding {
                        padding-left: 19px !important;
                        padding-right: 19px !important;
                      }
                    }
                    @media (max-width: 991px) {
                      .text-end.text-lg-center.mb-5 {
                        text-align: center !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        margin-bottom: 1rem !important;
                      }
                      .list-inline.list-unstyled.justify-content-end {
                        justify-content: center !important;
                        padding-right: 0 !important;
                      }
                    }
                  `}
                </style>
                <div className="row">
                  <div className="col">
                  <button onClick={handleBookmarkPost} className="btn btn-primary ms-2 custom-btn-padding" style={{ marginLeft: 0 }}>
                    <i className="fas fa-bookmark"></i>
                  </button>
                  </div>
                  <div className="col">
                  <button onClick={handleLikePost} className="btn btn-success custom-btn-padding" style={{ marginRight: 0 }}>
                    <i className="fas fa-thumbs-up"></i>
                  </button>
                  </div>
                </div>
                {/* Tags */}
                <ul className="list-inline text-primary-hover mt-0 mt-lg-3 text-end" style={{ paddingRight: 0 }}>
                  {tags?.map((tag, index) => (
                    <li className="list-inline-item mt-2" key={index}>
                      <a className="text-body text-decoration-none fw-bold" href="#">
                        #{tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="d-lg-none" />
            </div>
            {/* right sidebar END */}
            {/* Main Content START */}
            
            <div className="col-lg-10 mb-5">
              <h1 className="text-end" style={{marginBottom: "2rem"}}>{post?.title}</h1>
              {(post?.thumbnail || post?.image) && (
                <div className="mb-2 mt-2">
                  <img
                    src={post?.thumbnail || post?.image}
                    alt="post thumbnail"
                    style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                    onError={(e) => {
                      // Create shimmer effect placeholder
                      const shimmerHTML = `
                        <div style="
                          width: 100%;
                          height: 300px;
                          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                          background-size: 200% 100%;
                          animation: shimmer 1.5s infinite;
                          border-radius: 8px;
                          position: relative;
                          overflow: hidden;
                        ">
                          <style>
                            @keyframes shimmer {
                              0% { background-position: -200% 0; }
                              100% { background-position: 200% 0; }
                            }
                          </style>
                        </div>
                      `;
                      
                      // Replace the image with shimmer placeholder
                      const wrapper = e.target.parentElement;
                      wrapper.innerHTML = shimmerHTML;
                    }}
                  />
                </div>
              )}
              <br />
              <div style={{ whiteSpace: "pre-wrap" }}>
                <Editor
                  editorState={editorState}
                  readOnly={true}
                  blockRendererFn={mediaBlockRenderer}
                  customStyleMap={customStyleMap}
                />
              </div>

              <div className="mt-5">
                <h3> تعداد نظرات:{comments?.length}</h3>
                {comments?.map((c, index) => (
                  <div 
                    className="my-4 d-flex bg-light p-3 mb-3 rounded" 
                    key={index}
                  >
                    <div>
                      <div className="mb-2">
                        <h5 className="m-0">{c?.name}</h5>
                        <span className="me-3 small">{Moment(c?.date)}</span>
                      </div>
                      <p className="fw-bold">{c?.comment}</p>
                      {c?.reply && (
                        <>
                          <hr/> 
                          <p className="mb-1 text-muted small">پاسخ نویسنده:</p>
                          <p className="fw-bold text-secondary">{c?.reply}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Comments END */}
              {/* Reply START */}
              <div className="bg-light p-3 rounded">
                <h3 className="fw-bold">کامنت بگذارید</h3>
                <small>ایمیل شما منتشر نخواهد شد. فیلد‌های ستاره‌دار اجباریست</small>
                <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                  <div className="col-md-6">
                    <label className="form-label">نام *</label>
                    <input
                      onChange={handleCreateCommentChange}
                      name="full_name"
                      value={createComment.full_name}
                      type="text"
                      className="form-control"
                      aria-label="First name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ایمیل *</label>
                    <input onChange={handleCreateCommentChange} name="email" value={createComment.email} type="email" className="form-control" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">نظر خود را بنویسید *</label>
                    <textarea onChange={handleCreateCommentChange} name="comment" value={createComment.comment} className="form-control" rows={4} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-outline-primary">
                      ارسال <i className="fas fa-paper-plane"></i>
                    </button>
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

export default Detail;
