import { Link } from 'react-router-dom';
import startBtn from "@/assets/img/start_btn.png";
import styles from './Main.module.scss';

export default function Main() {
  return (
    <div className={styles.main}>
        <Link to="/game/gugudan">
            <img src={startBtn} alt="start" />
        </Link>
        <p>버튼을 눌러 게임을 시작하세요.</p>
    </div>
  )
}
