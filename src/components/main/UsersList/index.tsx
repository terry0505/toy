import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/apis/firebase";
import { UserType } from "@/types/firebase";

export default function UsersList() {
  const navigate = useNavigate();

  // 🔹 useQuery를 사용하여 Firebase에서 유저 목록 불러오기
  const {
    data: users,
    isLoading,
    isError
  } = useQuery<UserType[]>({
    queryKey: ["users"],
    queryFn: getUsers
  });

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (isError || !users) {
    return <p>유저 목록을 불러오는 중 오류가 발생했습니다.</p>;
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
