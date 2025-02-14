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
import Modal from "@/components/ui/Modal"; // Modal ������Ʈ �߰�
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
    staleTime: 60 * 1000, //�⺻ ������ 0 (fresh -> stale)
    gcTime: 300 * 100 // �⺻ ���� 300 * 1000, 5����
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
      message: "������ ȸ��Ż�� �����Ͻðڽ��ϱ�?",
      onConfirm: async () => {
        try {
          await removeUser();
          await logout();
          setCurrentUser(null);
          navigate("/login/general", { replace: true });
        } catch (error) {
          setModal({
            open: true,
            message: "ȸ��Ż�� �� ������ �߻��߽��ϴ�.",
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
