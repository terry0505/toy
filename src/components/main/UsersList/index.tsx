import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "@/apis/firebase";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        console.error("유저 목록을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div>
      <h2>회원 목록</h2>
      <ul>
        {users.map((user) => (
          <li key={user.uid} onClick={() => navigate(`/user/${user.uid}`)}>
            {user.displayName || "익명 사용자"}
          </li>
        ))}
      </ul>
    </div>
  );
}
