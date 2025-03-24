import { useState } from "react";
import toastr from "toastr";
import Loading from "@/components/ui/Loading";
import { addPost } from "@/apis/firebase";
import commonStyles from "@/assets/styles/common.module.scss";
import styles from "./PostWrite.module.scss";
import { useNavigate } from "react-router-dom";

function PostWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toastr.success("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await addPost(title, content);
      setTitle("");
      setContent("");
      toastr.success("글이 성공적으로 저장되었습니다!");

      navigate("/");
    } catch (err) {
      console.error(err);
      toastr.success("글 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.page__post__write}>
        <form onSubmit={handleSubmit}>
          <input
            className={commonStyles.commonInput}
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={commonStyles.commonTextarea}
            placeholder="내용을 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className={commonStyles.commonBtn}>
            <button>작성</button>
          </div>
          {loading && <Loading />}
        </form>
      </div>
    </div>
  );
}

export default PostWrite;
