import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import styles from "./Profile.module.scss";
import Loading from "@/components/ui/Loading";

function Profile() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.page__profile}>
        <ul className={styles.page__profile__info}>
          <li>
            <span className={styles.label}>이메일</span>
            <span className={styles.value}>{user?.email}</span>
          </li>
          <li>
            <span className={styles.label}>닉네임</span>
            <span className={styles.value}>
              {user?.displayName ?? "방문자"}
            </span>
          </li>
          <li>
            <span className={styles.label}>생성일</span>
            <span className={styles.value}>
              {dayjs(user?.createdAt).format("YYYY년 MM월 DD일 A HH시 mm분")}
            </span>
          </li>
          <li>
            <span className={styles.label}>마지막 접속일</span>
            <span className={styles.value}>
              {dayjs(user?.lastLogin).format("YYYY년 MM월 DD일 A HH시 mm분")}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
