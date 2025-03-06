import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/apis/firebase";
import { UserType } from "@/types/firebase";

export default function User() {
  const { uid } = useParams(); // URL에서 uid 가져오기

  // useQuery
  const {
    data: user,
    isLoading,
    isError
  } = useQuery<UserType>({
    queryKey: ["user", uid],
    queryFn: () => getUserById(uid),
    enabled: !!uid
  });

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (isError || !user) {
    return <p>유저 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h2>{user.displayName || "익명 사용자"}님의 프로필</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>가입 날짜:</strong>{" "}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "알 수 없음"}
      </p>
    </div>
  );
}
