import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toastr from "toastr";
import Loading from "@/components/ui/Loading";
import { deletePost, getPostById } from "@/apis/firebase";
import { formatDate, formatTextWithLine } from "@/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import commonStyles from "@/assets/styles/common.module.scss";
import styles from "./PostDetail.module.scss";

function PostDetail() {
  const { user } = useAuthContext();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(postId);
        setPost(postData);
      } catch (err) {
        console.error(err);
        toastr.error("글을 불러오는 중 오류가 발생했습니다.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      toastr.success("글이 삭제되었습니다.");
      navigate("/");
    } catch (err) {
      console.error(err);
      toastr.error("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (post) {
    return (
      <div className={styles.page}>
        <h1>{post.title}</h1>
        <div
          className={styles.page__post__title}
          dangerouslySetInnerHTML={{
            __html: formatTextWithLine(post.content)
          }}
        ></div>
        <p className={styles.page__post__date}>
          {formatDate(post.createdAt.seconds, ".")}
        </p>
        <div className={commonStyles.commonBtn}>
          <button onClick={() => navigate("/")}>목록</button>
          {user && user.uid === post.author && (
            <>
              <button onClick={() => navigate(`/post/edit/${postId}`)}>
                수정
              </button>
              <button onClick={handleDelete}>삭제</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default PostDetail;
