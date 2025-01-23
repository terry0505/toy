import { Link } from 'react-router-dom';
import styles from './Main.module.scss';
import { useAuthContext } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Main() {
    const {user,socialLogin,login,logout,signup } = useAuthContext();
    const [tab, setTab] = useState<number>(1);
    const [authType, setAuthType] = useState<string>('');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState<string>('');

    useEffect(()=>{
        console.log(user);
    }, [user]);

    const handleTab = (number) => () => {
        if (number == 1) {
            setAuthType('');
        }
        setTab(number);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(authType === 'login') {
            login(email, password);
        } else if (authType === 'signup') {
            signup(email, password);
        }
    }
  
    return (
        <div className={styles.main}>


        {user ? (
            <>  
                <div><button onClick={logout}>로그아웃</button></div>
                <ul className={styles.navbar} >
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
                    <Link to="/game/tictactoe">틱택토</Link>
                    </li>
                    <li>
                    <Link to="/game/mine-search">지뢰찾기</Link>
                    </li>
                </ul>
            </>
        ) : (
            <div>
                <ul>
                    <li onClick={handleTab(1)}>
                        social 인증
                    </li>
                    <li onClick={handleTab(2)}>
                        일반 인증
                    </li>
                </ul>
                { tab == 1 && (
                    <div>
                        <div>
                            <button onClick={socialLogin('google')}>구글 로그인/회원가입</button>
                            <button onClick={socialLogin('github')}>깃헙 로그인/회원가입</button>
                        </div>
                    </div>
                )}
                {tab == 2 && (
                    <div>
                        {authType == '' && (
                            <div>
                                <button onClick={()=> setAuthType('login')}>로그인</button>
                                <button onClick={()=> setAuthType('signup')}>회원가입</button>
                            </div>
                        )}
                        {authType == 'login' && (
                            <div>
                                <form action="">
                                    <input type="email" placeholder='이메일을 입력해주세요' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <input type="password" placeholder='비밀번호를 입력해주세요' onChange={(e) => setPassword(e.target.value)} />
                                    <button>일반 로그인</button>
                                </form>
                            </div>
                        )}
                        {authType == 'signup' && (
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" />
                                    <input type="text" />
                                    <button>일반 회원가입</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}  

        </div>
    )
}
