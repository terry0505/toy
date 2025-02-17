import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  socialLogin,
  login,
  logout,
  signup,
  fetchUser,
  removeUser
} from "@apis/firebase";
import Modal from "@/components/ui/Modal"; // Modal 컴포넌트 추가
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  //const [user, setUser] = useState<any>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    message: "",
    onConfirm: null
  });

  const {
    data: isUser,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchUser,
    staleTime: 60 * 1000, //기본 설정은 0 (fresh -> stale)
    gcTime: 300 * 100 // 기본 값이 300 * 1000, 5분임
  });
  //   useEffect(() => {
  //     onUserStateChange((user) => setUser(user));
  //   }, []);

  useEffect(() => {
    setCurrentUser(isUser);
  }, [isUser]);

  const handleRemoveUser = async () => {
    setModal({
      open: true,
      message: "정말로 회원탈퇴를 진행하시겠습니까?",
      onConfirm: async () => {
        try {
          await removeUser();
          await logout();
          setCurrentUser(null);
          setModal({
            open: true,
            message: "회원탈퇴가 완료되었습니다.",
            onConfirm: () => navigate("/login/social")
          });
        } catch (error) {
          setModal({
            open: true,
            message: "회원탈퇴 중 오류가 발생했습니다.",
            onConfirm: null
          });
        }
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        uid: currentUser && currentUser.uid,
        isLoading,
        isError,
        socialLogin,
        login,
        logout,
        signup,
        removeUser: handleRemoveUser
      }}
    >
      {children}
      {modal.open && (
        <Modal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onClose={() =>
            setModal({ open: false, message: "", onConfirm: null })
          }
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
