import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toastr from "toastr";
import cx from "classnames";
import { getPosts } from "@/apis/firebase";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/utils";
import commonStyles from "@/assets/styles/common.module.scss";
import styles from "./PostList.module.scss";

function PostsList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
        toastr.error("글을 불러오는 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (posts.length == 0) {
    return (
      <div className={styles.page}>
        <p className={styles.page__post__nodata}>글이 없습니다.</p>
        <Link
          to="/post/write"
          className={cx(styles.page__post__btn, commonStyles.commonBtnStyle)}
        >
          글 작성하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ul className={styles.page__post__list}>
        {posts.map((post) => (
          <li key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
            <span className={styles.title}>{post.title}</span>
            <span className={styles.date}>
              {formatDate(post.createdAt.seconds)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsList;
