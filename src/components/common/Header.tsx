import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import styles from "@/components/common/Header.module.scss";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout, removeUser } = useAuthContext();
  const [modal, setModal] = useState({
    open: false,
    message: "",
    onConfirm: null
  });

  const handleLogout = async () => {
    await logout();
    await queryClient.invalidateQueries({
      queryKey: ["user", "me"]
    });
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/">Vite + React.js로 웹게임 만들기</Link>
      </h1>
      <div className={styles.header__utilmenu}>
        {user ? (
          <>
            {user.displayName && (
              <Link to="/profile">{user.displayName}님 반갑습니다.</Link>
            )}
            <button onClick={handleLogout}>로그아웃</button>
            <button onClick={removeUser}>회원탈퇴</button>
            <button onClick={() => navigate(`/user/${user.uid}`)}>
              내 유저 페이지
            </button>
          </>
        ) : (
          <Link to="/login">회원가입/로그인</Link>
        )}
      </div>
      {modal.open && (
        <Modal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onClose={() =>
            setModal({ open: false, message: "", onConfirm: null })
          }
        />
      )}
    </header>
  );
}
