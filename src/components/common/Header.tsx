import { Link } from 'react-router-dom';
import styles from '@/components/common/Header.module.scss';


export default function Header() {
  return (
    <header className={styles.header}>
      <h1>GAME STEP</h1>
      <ul className={styles.navbar}>
        <li>
          <Link to="/game/gugudan">STEP1</Link>
        </li>
        <li>
          <Link to="/game/word-relay">STEP2</Link>
        </li>
        <li>
          <Link to="/game/number-baseball">STEP3</Link>
        </li>
        <li>
          <Link to="/game/response-check">STEP4</Link>
        </li>
        <li>
          <Link to="/game/rsp">STEP5</Link>
        </li>
        <li>
          <Link to="/game/lotto">STEP6</Link>
        </li>
        <li>
          <Link to="/game/tictactoe">STEP7</Link>
        </li>
        <li>
          <Link to="/game/mine-search">STEP8</Link>
        </li>
      </ul>
    </header>
  )
}

