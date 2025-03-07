import { Link, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import styles from "@/components/common/Header.module.scss";

export default function Header() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuthContext();
  const handleLogout = async () => {
    await logout();
    await queryClient.invalidateQueries({
      queryKey: ["user", "me"]
    });
    Navigate("/login");
  };

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/">Vite + React.js로 웹게임 만들기</Link>
      </h1>
      <div className={styles.util_menu}>
        {user ? (
          <>
            {user.displayName && (
              <Link to="/profile">{user.displayName}님 반갑습니다.</Link>
            )}
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <Link to="/login">회원가입/로그인</Link>
        )}
      </div>
    </header>
  );
}
