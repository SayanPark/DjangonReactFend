import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";
import { Editor, EditorState, AtomicBlockUtils, Modifier, CompositeDecorator, convertToRaw, RichUtils} from "draft-js";
import "draft-js/dist/Draft.css";
import * as setImmediate from 'setimmediate';

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

function AddPost() {
  const [post, setCreatePost] = useState({ title: "", category: parseInt(""), tags: "", status: "",});
  const [imagePreview, setImagePreview] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const user_id = useUserData()?.user_id || null;
  const navigate = useNavigate();

  const customStyleMap = {
    'FONT_SIZE_12': { fontSize: '12px' },
    'FONT_SIZE_14': { fontSize: '14px' },
    'FONT_SIZE_16': { fontSize: '16px' },
    'FONT_SIZE_18': { fontSize: '18px' },
    'FONT_SIZE_20': { fontSize: '20px' },
  };

  const toggleBold = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const toggleItalic = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const changeFontSize = (size) => {
    const style = `FONT_SIZE_${size}`;
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const fetchCategory = async () => {
    try {
      const response = await apiInstance.get(`post/category/list/`);
      setCategoryList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleCreatePostChange = (event) => {
    setCreatePost({
      ...post,
      [event.target.name]: event.target.value,
    });
  };

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const addMedia = (file, type) => {
    const reader = new FileReader();
    reader.onload = () => {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        type,
        "IMMUTABLE",
        { src: reader.result, type }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        " "
      );
      setEditorState(newEditorState);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
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
      setCreatePost({
        ...post,
        image: file,
      });
    }
  };

  const promptForLink = () => {
    Swal.fire({
      title: 'افزودن لینک',
      html:
        '<input id="swal-link-text" class="swal2-input" placeholder="متن لینک">' +
        '<input id="swal-link-url" class="swal2-input" placeholder="آدرس لینک">',
      focusConfirm: false,
      preConfirm: () => {
        const linkText = document.getElementById('swal-link-text').value;
        const linkUrl = document.getElementById('swal-link-url').value;
        if (!linkText || !linkUrl) {
          Swal.showValidationMessage('لطفا متن لینک و آدرس لینک را وارد کنید');
          return false;
        }
        return { linkText, linkUrl };
      }
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

          const newEditorState = EditorState.push(editorState, newContentState, "insert-characters");
          setEditorState(newEditorState);
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!post.title) {
      Toast("error", "لطفا عنوان را وارد کنید");
      setIsLoading(false);
      return;
    }
    if (!post.category) {
      Toast("error", "لطفا زیرمجموعه مقاله را انتخاب کنید");
      setIsLoading(false);
      return;
    }
    if (!editorState.getCurrentContent().hasText()) {
      Toast("error", "لطفا مقاله را وارد کنید");
      setIsLoading(false);
      return;
    }
    if (!post.tags) {
      Toast("error", "لطفا کلیدواژه‌ها را وارد کنید");
      setIsLoading(false);
      return;
    }
    if (!post.image) {
      Toast("error", "لطفا تصویر شاخص را انتخاب کنید");
      setIsLoading(false);
      return;
    }
    if (!user_id) {
      Toast("error", "کاربر احراز هویت نشده است");
      setIsLoading(false);
      return;
    }
    if (!post.status) {
      Toast("error", "لطفا وضعیت پست را مشخص نمایید");
      setIsLoading(false);
      return;
    }
    const formdata = new FormData();
    formdata.append("user_id", user_id);
    formdata.append("title", post.title);
    formdata.append("description", JSON.stringify(convertToRaw(editorState.getCurrentContent())));
    formdata.append("tags", post.tags);
    formdata.append("category", post.category);
    formdata.append("post_status", post.status);
    if (post.image) {
      formdata.append("image", post.image);
    }

    try {
      const response = await apiInstance.post("author/dashboard/post-create/", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "پست با موفقیت ساخته شد",
      });
      navigate("/posts/");
    } catch (error) {
      console.log(error);
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
                            <h1 className="text-white mb-1">پست جدید بسازید</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <form onSubmit={handleSubmit} className="pb-8 mt-5">
                  <div className="card mb-3">
                    <div className="card-header border-bottom px-4 py-3">
                      <h4 className="mb-0">اضافه کردن اطلاعات</h4>
                    </div>
                    <div className="card-body">
                    <label htmlFor="postTHumbnail" className="form-label">
                        نمایش عکس
                    </label>
                    <img style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px" }} className="mb-4" src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"} alt="" />
                    <div className="mb-3">
                      <label htmlFor="postTHumbnail" className="form-label">
                          عکس کاور پست
                      </label>
                      <input onChange={handleFileChange} name="image" id="postTHumbnail" className="form-control" type="file" />
                    </div>
                      <div className="mb-3">
                        <label className="form-label">عنوان</label>
                        <input className="form-control" onChange={handleCreatePostChange} name="title" type="text" placeholder="" />
                        <small>عنوان مقاله را بنویسید</small>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">زیرمجموعه مقاله</label>
                        <select className="form-select" onChange={handleCreatePostChange} name="category">
                          <option value="">-------------</option>
                          {categoryList?.map((c, index) => (
                            <option key={index} value={c?.id}>
                              {c?.title}
                            </option>
                          ))}
                        </select>
                        <small>انتخاب کردن دپارتمان مربوط به مقاله‌تان به مخاطبان کمک می‌کند تا راحت‌تر به مقاله دسترسی داشته باشند</small>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">مقاله</label>
                        <br/>
                        <small>مقاله خود را اینجا بنویسید</small>
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
                            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={promptForLink}
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
                                <input type="text" className="form-control mb-2" placeholder="متن لینک را وارد کنید" value={linkText}
                                  onChange={(e) => setLinkText(e.target.value)}
                                />
                                <input type="text" className="form-control" placeholder="آدرس لینک را وارد کنید" value={linkUrl}
                                  onChange={(e) => setLinkUrl(e.target.value)}
                                />
                                <button type="button" className="btn btn-primary mt-2"> تایید </button>
                                <button type="button" className="btn btn-secondary mt-2" onClick={() => setLinkInputVisible(false)}>
                                  لغو
                                </button>
                              </div>
                            )}
                          </div>
                          <button type="button" className="btn btn-outline-secondary btn-lg" onClick={toggleBold}
                            style={{
                              outline: "none",
                              boxShadow: "none",
                              border: "none",
                              padding: 0,
                            }}
                          >
                            <i className="bi bi-type-bold"></i>
                          </button>
                          <button type="button" className="btn btn-outline-secondary btn-lg" onClick={toggleItalic}
                            style={{
                            outline: "none",
                            boxShadow: "none",
                            border: "none",
                            padding: 0,
                          }}
                          >
                            <i className="bi bi-type-italic"></i>
                          </button>
                          <select className="form-select" onChange={(e) => changeFontSize(e.target.value)} style={{ width: "auto", fontSize: "12px" }}>
                            <option value="12">12px</option>
                            <option value="14">14px</option>
                            <option value="16">16px</option>
                            <option value="18">18px</option>
                            <option value="20">20px</option>
                          </select>
                          <hr />
                          <div style={{ flexGrow: 1, overflowY: "auto" }}>
                            <Editor editorState={editorState} onChange={onChange} blockRendererFn={mediaBlockRenderer} customStyleMap={customStyleMap} style={{ direction: "rtl", minHeight: "100%" }}/>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3" style={{ display: "none" }}>
                        <input id="fileUpload" type="file" accept="image/*,video/*" onChange={handleFileUpload} />
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
                      <input onChange={handleCreatePostChange} name="tags" className="form-control" type="text" placeholder="کلیدواژه های مربوط به مقاله را بنویسید" />
                    </div>
                  </div>
                  {isLoading === true ? (
                    <button disabled className="btn btn-lg btn-secondary w-100 mt-2" type="submit">
                      درحال پست سازی <i className="fas fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                      ایجاد پست <i className="fas fa-check-circle"></i>
                    </button>
                  )}
                </form>
              </>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddPost;
