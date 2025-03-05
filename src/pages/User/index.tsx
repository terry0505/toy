import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "@/apis/firebase";
import UsersList from "@/components/main/UsersList";

export default function User() {
  const { uid } = useParams(); // URL에서 uid 가져오기
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!uid) return;
      try {
        const userData = await getUserById(uid);
        setUser(userData);
      } catch (error) {
        console.error("유저 정보를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [uid]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (!user) {
    return <p>유저 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h2>{user.displayName || "익명 사용자"}님의 프로필</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>가입 날짜:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

      <div>
        <h3>다른 유저 목록</h3>
        <UsersList />
      </div>
    </div>
  );
}
