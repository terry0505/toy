import { Link } from "react-router-dom";
import styles from "@/pages/Main/Main.module.scss";

export default function GameList() {
  return (
    <ul className={styles.page__list}>
      <li>
        <Link to="/game/gugudan">구구단</Link>
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
        <Link to="/game/tictactoe">- 틱택토</Link>
      </li>
      <li>
        <Link to="/game/mine-search">- 지뢰찾기</Link>
      </li>
    </ul>
  );
}
