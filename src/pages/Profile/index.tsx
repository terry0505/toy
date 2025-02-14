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
            <span className={styles.label}>�̸���</span>
            <span className={styles.value}>{user?.email}</span>
          </li>
          <li>
            <span className={styles.label}>�г���</span>
            <span className={styles.value}>
              {user?.displayName ?? "�湮��"}
            </span>
          </li>
          <li>
            <span className={styles.label}>������</span>
            <span className={styles.value}>
              {dayjs(user?.createdAt).format("YYYY�� MM�� DD�� A HH�� mm��")}
            </span>
          </li>
          <li>
            <span className={styles.label}>������ ������</span>
            <span className={styles.value}>
              {dayjs(user?.lastLogin).format("YYYY�� MM�� DD�� A HH�� mm��")}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
