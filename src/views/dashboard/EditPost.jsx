import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";
import { Editor, EditorState, convertFromRaw, ContentState, AtomicBlockUtils, Modifier, CompositeDecorator, convertToRaw} from "draft-js";
import "draft-js/dist/Draft.css";
import * as setImmediate from 'setimmediate';
import ShimmerImage from "../../components/ShimmerImage";

if (typeof window !== 'undefined' && !window.setImmediate) {
  window.setImmediate = setImmediate;
}

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
  if (!url.startsWith("http://") && !url.startsWith("https://")) {url = "https://" + url;}

  const handleClick = (e) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <a href={url} style={{ color: "blue", textDecoration: "underline" }} onClick={handleClick} target="_blank" rel="noopener noreferrer">
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

function MediaBlock(props) {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src, type } = entity.getData();

  let media;
  if (type === "image") {
    media = <img src={src} alt="" style={{ maxWidth: "50%", maxHeight: "300px", objectFit: "contain" }} />;
  } else if (type === "video") {
    media = (
      <video controls style={{ maxWidth: "50%", maxHeight: "300px", objectFit: "contain" }}>
        <source src={src} type="video/mp4" />
        مرورگر شما از ویدئو پشتیبانی نمی‌کند، مجددا تلاش کنید
      </video>
    );
  }
  return media;
}

function mediaBlockRenderer(block) {
  if (block.getType() === "atomic") {
    return {
      component: MediaBlock,
      editable: false,
    };
  }
  return null;
}

function EditPost() {
  const [post, setEditPost] = useState({ title: "", category: "", tags: "", status: ""});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const userId = useUserData()?.user_id || null;
  const navigate = useNavigate();
  const param = useParams();

  const fetchCategory = async () => {
    try {
      const response = await apiInstance.get(`post/category/list/`);
      setCategoryList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await apiInstance.get(
        `author/dashboard/post-detail/${userId}/${param.id}/`
      );
      const data = response.data;
      setEditPost({
        title: data.title,
        category: data.category === null || isNaN(parseInt(data.category)) ? "" : data.category,
        tags: data.tags,
        status: data.status,
      });
      if (data.image) {
        setImagePreview(data.image);
      }
      if (data.description) {
        // Helper function to parse JSON multiple times until an object with blocks is obtained or no more parsing possible
        function tryParseDescription(desc) {
          let parsed = desc;
          for (let i = 0; i < 3; i++) {
            if (typeof parsed === "string") {
              try {
                parsed = JSON.parse(parsed);
              } catch {
                break;
              }
            } else {
              break;
            }
          }
          return parsed;
        }

        try {
          const parsedDescription = tryParseDescription(data.description);
          if (parsedDescription && parsedDescription.blocks && Array.isArray(parsedDescription.blocks)) {
            setEditorState(
              EditorState.createWithContent(convertFromRaw(parsedDescription), decorator)
            );
          } else {
            const plainText = typeof parsedDescription === "object" && parsedDescription.blocks
              ? parsedDescription.blocks.map(block => block.text).join("\n")
              : data.description;
            setEditorState(EditorState.createWithContent(ContentState.createFromText(plainText)));
          }
        } catch (parseError) {
          // Fallback to plain text if parsing fails
          const plainText = typeof data.description === "string" ? data.description : JSON.stringify(data.description);
          setEditorState(EditorState.createWithContent(ContentState.createFromText(plainText)));
        }
      } else {
        setEditorState(EditorState.createEmpty(decorator));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchPost();
  }, []);

  const handleCreatePostChange = (event) => {
    setEditPost({
      ...post,
      [event.target.name]: event.target.value,
    });
  };

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  // Add a function to programmatically insert media blocks into the editor content
  const insertMediaBlock = (src, type) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(type, "IMMUTABLE", { src, type });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, " ");
    setEditorState(newEditorState);
  };

  // Modify addMedia to use insertMediaBlock
  const addMedia = (file, type) => {
    const reader = new FileReader();
    reader.onload = () => {
      insertMediaBlock(reader.result, type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : null;
      if (fileType) {
        addMedia(file, fileType);
      } else {
        Toast("error", "نوع فایل پشتیبانی نمی‌شود. لطفاً یک تصویر یا ویدیو آپلود کنید.");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setEditPost({
        ...post,
        image: file,
      });
    }
  };

  const promptForLink = () => {
    Swal.fire({
      title: "افزودن لینک",
      html:
        '<input id="swal-link-text" class="swal2-input" placeholder="متن لینک">' +
        '<input id="swal-link-url" class="swal2-input" placeholder="آدرس لینک">',
      focusConfirm: false,
      preConfirm: () => {
        const linkText = document.getElementById("swal-link-text").value;
        const linkUrl = document.getElementById("swal-link-url").value;
        if (!linkText || !linkUrl) {
          Swal.showValidationMessage("لطفا متن لینک و آدرس لینک را وارد کنید");
          return false;
        }
        return { linkText, linkUrl };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { linkText, linkUrl } = result.value;
        if (linkText && linkUrl) {
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            "LINK",
            "MUTABLE",
            { url: linkUrl }
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

          // Insert the link text with the link entity
          const selection = editorState.getSelection();
          let newContentState = Modifier.replaceText(
            contentStateWithEntity,
            selection,
            linkText,
            null,
            entityKey
          );

          const newEditorState = EditorState.push(
            editorState,
            newContentState,
            "insert-characters"
          );
          setEditorState(newEditorState);
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!post.status) {
      Toast("error", "لطفا وضعیت پست را مشخص نمایید");
      setIsLoading(false);
      return;
    }
    try {
      const descriptionRaw = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("category", post.category);
      formData.append("tags", post.tags);
      formData.append("post_status", post.status);
      formData.append("description", descriptionRaw);
      if (post.image) {
        formData.append("image", post.image);
      }
      await apiInstance.put(`author/dashboard/post-detail/${userId}/${param.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Toast("success", "پست با موفقیت به‌روزرسانی شد");
      navigate("/dashboard/posts/");
    } catch (error) {
      console.error(error);
      Toast("error", "خطا در به‌روزرسانی پست");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="pt-5 pb-5" style={{ direction: "rtl" }}>
        <div className="container">
          <div className="row mt-0 mt-md-4">
            <div className="col-lg-12 col-md-8 col-12">
              <>
                <section className="py-4 py-lg-6 bg-primary rounded-3" style={{ position: "relative" }}>
                  <div className="container">
                    <div className="row">
                      <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                        <div className="d-lg-flex align-items-center justify-content-start">
                          <div className="">
                            <h1 className="text-white mb-1">ویرایش پست</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <form onSubmit={handleSubmit} className="pb-8 mt-5">
                  <div className="card mb-3">
                    <div className="card-header border-bottom px-4 py-3">
                      <h4 className="mb-0">ویرایش اطلاعات</h4>
                    </div>
                    <div className="card-body">
                      <label htmlFor="postTHumbnail" className="form-label">
                        نمایش عکس
                      </label>
                      {imageError ? (
                        <ShimmerImage 
                          width="100%" 
                          height="330px" 
                          style={{ borderRadius: "10px", marginBottom: "1.5rem" }}
                        />
                      ) : (
                        <img 
                          style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px",}}
                          className="mb-4"
                          src={ imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                          alt=""
                          onError={() => setImageError(true)}
                        />
                      )}
                      <div className="mb-3">
                        <label htmlFor="postTHumbnail" className="form-label">
                        عکس کاور پست
                        </label>
                        <input
                          onChange={handleFileChange}
                          name="image"
                          id="postTHumbnail"
                          className="form-control"
                          type="file"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">عنوان</label>
                        <input
                          className="form-control"
                          onChange={handleCreatePostChange}
                          name="title"
                          type="text"
                          placeholder=""
                          value={post.title}
                        />
                        <small>عنوان مقاله را بنویسید</small>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">زیرمجموعه مقاله</label>
                        <select
                          className="form-select"
                          onChange={handleCreatePostChange}
                          name="category"
                          value={post.category}
                        >
                          <option value="">-------------</option>
                          {categoryList?.map((c, index) => (
                            <option key={index} value={c?.id}>
                              {c?.title}
                            </option>
                          ))}
                        </select>
                        <small>
                          انتخاب کردن دپارتمان مربوط به مقاله‌تان به مخاطبان کمک
                          می‌کند تا راحت‌تر به مقاله دسترسی داشته باشند
                        </small>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">مقاله</label>
                        <br/>
                        <small className="mb-3">مقاله خود را اینجا بنویسید</small>
                        <div className="mb-3 d-flex flex-column" style={{ border: "1px solid #ccc", height: "300px", padding: "10px" }}>
                          <div className="mb-3 d-flex gap-2" style={{ flexShrink: 0 }}>
                            <input id="fileUploadImage" type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }}/>
                            <label htmlFor="fileUploadImage" className="btn btn-outline-secondary btn-lg" style={{outline: "none",boxShadow: "none",border: "none",padding: 0,}}>
                              <i className="bi bi-image"></i>
                            </label>
                            <input id="fileUploadVideo" type="file" accept="video/*" onChange={handleFileUpload} style={{ display: "none" }}/>
                            <label htmlFor="fileUploadVideo" className="btn btn-outline-secondary btn-lg" style={{ outline: "none", boxShadow: "none", border: "none", padding: 0,}}>
                              <i className="bi bi-camera-video"></i>
                            </label>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-lg"
                              onClick={promptForLink}
                              style={{
                                outline: "none",
                                boxShadow: "none",
                                border: "none",
                                padding: 0,
                              }}
                            >
                              <i className="bi bi-link-45deg"></i>
                            </button>
                            {linkInputVisible && (
                              <div className="input-group mt-2">
                                <input
                                  type="text"
                                  className="form-control mb-2"
                                  placeholder="متن لینک را وارد کنید"
                                  value={linkText}
                                  onChange={(e) => setLinkText(e.target.value)}
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="آدرس لینک را وارد کنید"
                                  value={linkUrl}
                                  onChange={(e) => setLinkUrl(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary mt-2"
                                >
                                  تایید
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary mt-2"
                                  onClick={() => setLinkInputVisible(false)}
                                >
                                  لغو
                                </button>
                              </div>
                            )}
                          </div>
                          <hr />
                          <div style={{ flexGrow: 1, overflowY: "auto" }}>
                            <Editor
                              editorState={editorState}
                              onChange={onChange}
                              blockRendererFn={mediaBlockRenderer}
                              style={{ direction: "rtl", minHeight: "100%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3" style={{ display: "none" }}>
                      <input
                        id="fileUpload"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">وضعیت مقاله</label>
                    <select className="form-select" name="status" onChange={handleCreatePostChange} id="" value={post.status}>
                      <option value="">-------</option>
                      <option value="Active">فعال</option>
                      <option value="Draft">پیش‌ نویس</option>
                      <option value="Disabled">غیرفعال</option>
                    </select>
                  </div>
                  <label className="form-label">کلیدواژه‌ها</label>
                  <input
                    onChange={handleCreatePostChange}
                    name="tags"
                    className="form-control"
                    type="text"
                    placeholder="کلیدواژه های مربوط به مقاله را بنویسید"
                    value={post.tags}
                  />
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                  </div>
                </form>
              </>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditPost;
