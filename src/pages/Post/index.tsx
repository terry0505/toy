import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "@/apis/firebase";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/utils";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import commonStyles from "@/assets/styles/common.module.scss";
import styles from "@components/main/PostList/PostList.module.scss";

const LIMIT = 10;

function Post() {
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const triggerRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getPosts();
      setAllPosts(data);

      const initial = data.slice(0, LIMIT);
      setVisiblePosts(initial);
      setHasMore(data.length > LIMIT);
      setLoading(false);
    };
    fetch();
  }, []);

  const loadMore = useCallback(() => {
    setVisiblePosts((prev) => {
      const next = allPosts.slice(prev.length, prev.length + LIMIT);
      const updated = [...prev, ...next];
      setHasMore(updated.length < allPosts.length);
      return updated;
    });
  }, [allPosts]);

  // observer-trigger 방식 사용
  useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    observeTarget: triggerRef
  });

  if (loading) return <Loading />;

  return (
    <div className={styles.page}>
      <h2 className={styles.page__title}>전체 게시글</h2>
      <ul className={styles.page__post__list}>
        {visiblePosts.map((post) => (
          <li key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
            <span className={styles.title}>{post.title}</span>
            <span className={styles.date}>
              {formatDate(post.createdAt.seconds)}
            </span>
          </li>
        ))}
      </ul>

      {!hasMore && (
        <p className={styles.page__post__end}>더 이상 게시글이 없습니다.</p>
      )}

      <div className={commonStyles.commonBtn}>
        <button onClick={() => navigate("/")}>목록</button>
      </div>

      <div ref={triggerRef} style={{ height: "150px" }} />
    </div>
  );
}

export default Post;
