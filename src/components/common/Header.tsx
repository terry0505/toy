import { Link } from 'react-router-dom';
import { useRef } from 'react';
import styles from '@/components/common/Header.module.scss';

export default function Header() {
  const navbarRef = useRef<HTMLUListElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (navbarRef.current) {
      // 모든 <li>에서 'on' 클래스 제거
      Array.from(navbarRef.current.children).forEach((li) => {
        li.classList.remove('on');
      });

      // 클릭된 <li>에 'on' 클래스 추가
      (e.currentTarget as HTMLElement).classList.add('on');
    }
  };

  return (
    <header className={styles.header}>
      <h1>GAME STEP</h1>
      <ul className={styles.navbar} ref={navbarRef}>
        <li onClick={handleClick}>
          <Link to="/game/gugudan">STEP1</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/game/word-relay">STEP2</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/game/number-baseball">STEP3</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/game/response-check">STEP4</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/game/rsp">STEP5</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/game/lotto">STEP6</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/game/tictactoe">STEP7</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/game/mine-search">STEP8</Link>
        </li>
      </ul>
    </header>
  );
}
