import styles from '@/components/common/Header.module.scss';
import { useAuthContext } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
    const {user, logout} = useAuthContext();

    return (
    <header className={styles.header}>
        <h1>
            <Link to="/">Vite + React.js로 웹게임 만들기</Link> 
        </h1>
        <div className={styles.utilmenu}>
            {
                user ? (
                    <button onClick={logout}>로그아웃</button>
                ) : (
                    <Link to="/login/general">회원가입/로그인</Link>
                )
            }
        </div>
    </header>
  );
}