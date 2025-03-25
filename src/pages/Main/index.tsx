import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import styles from "@/pages/Main/Main.module.scss";
import UsersList from "@/components/main/UserList";
import PostsList from "@/components/main/PostList";
import GameList from "@/components/main/GameList";

function Main() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading]);

  return (
    <div className={styles.page}>
      <p className={styles.page__message}>
        해당 서비스는 리액트 교육 목적으로 제작 되었습니다.
      </p>

      <div className={styles.page__wrapper}>
        <div className={styles.page__content}>
          <h3 className={styles.page__title}>글 목록</h3>
          <PostsList />
        </div>
        <div className={styles.page__content}>
          <h3 className={styles.page__title}>게임 목록</h3>
          <GameList />
        </div>
        <div className={styles.page__content}>
          <UsersList />
        </div>
      </div>
    </div>
  );
}

export default Main;
