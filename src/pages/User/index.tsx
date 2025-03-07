import { getUser } from "@/apis/firebase";
import Loading from "@/components/ui/Loading";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function User() {
  const { uid } = useParams<{ uid: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const isUser = await getUser(uid);
        setUser(isUser);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <ul>
        <li>
          <span>이메일</span>
          <span>{user?.email}</span>
        </li>
        <li>
          <span>닉네임</span>
          <span>{user?.displayName ?? "방문자"}</span>
        </li>
        <li>
          <span>생성일</span>
          <span>
            {dayjs(user?.createAt).format("YYYY년 MM월 DD일 A HH시 mm분")}
          </span>
        </li>
        <li>
          <span>마지막 접속일</span>
          <span>
            {dayjs(user?.lastLogin).format("YYYY년 MM월 DD일 A HH시 mm분")}
          </span>
        </li>
      </ul>
    </div>
  );
}
