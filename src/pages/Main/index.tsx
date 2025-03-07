import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import styles from "./Main.module.scss";
import UsersList from "@/components/main/UsersList";

export default function Main() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      // 인증되지 않은 회원은
      navigate("/login"); // 로그인 페이지로
    }
  }, [user]);

  return (
    <div className={styles.main}>
      <ul className={styles.navbar}>
        <li>
          <Link to="/game/gugudan">구구단1</Link>
        </li>
        <li>
          <Link to="/game/word-relay">끝말잇기</Link>
        </li>
        <li>
          <Link to="/game/number-baseball">숫자야구</Link>
        </li>
        <li>
          <Link to="/game/response-check">반응속도체크</Link>
        </li>
        <li>
          <Link to="/game/rsp">가위바위보</Link>
        </li>
        <li>
          <Link to="/game/lotto">로또</Link>
        </li>
        <li>
          <Link to="/game/tictactoe">틱택토</Link>
        </li>
        <li>
          <Link to="/game/mine-search">지뢰찾기</Link>
        </li>
      </ul>

      <UsersList />
    </div>
  );
}
