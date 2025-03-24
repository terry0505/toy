import { getUsers } from "@/apis/firebase";
import { IUser } from "@/types/firebase";
import { useEffect, useState } from "react";
import Loading from "../../ui/Loading";
import { Link } from "react-router-dom";
import styles from "./UsersList.module.scss";

export default function UsersList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("유저 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);
  if (loading) {
    return <Loading fixed={false} />;
  }
  return (
    <div className={styles.list}>
      <h3 className={styles.title}>회원 목록</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>{user.email}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
