import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "@/apis/firebase";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/utils";
import commonStyles from "@/assets/styles/common.module.scss";
import styles from "@components/main/PostList/PostList.module.scss";

function Post() {
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
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className={styles.page}>
      <h2 className={styles.page__title}>전체 게시글</h2>
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
      <div className={commonStyles.commonBtn}>
        <button onClick={() => navigate("/")}>목록</button>
      </div>
    </div>
  );
}

export default Post;
