import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { AuthType, SocialProvider } from "@/types/firebase";
import styles from "./Login.module.scss";

function Login() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { socialLogin, login, signup } = useAuthContext();
  const [authType, setAuthType] = useState<AuthType>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (id == undefined) {
      navigate("/login/social");
    }
  }, [id]);

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [authType]);

  const handleTab = (path: string) => () => {
    navigate(path);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let user = null;
      let signedUser = null;
      if (authType === "login") {
        user = await login(email, password);
        console.log("로그인 결과 : ", user);
      } else if (authType === "signup") {
        signedUser = await signup(email, password);
        console.log("회원가입 결과 : ", signedUser);
      }
      if (user || signedUser) {
        // 인증 성공하면
        navigate("/");
      }
    } catch (error) {}
  };

  const handleSocialLogin = (provider: SocialProvider) => async (e) => {
    e.preventDefault();
    try {
      const user = await socialLogin(provider)();
      console.log("로그인 성공 : ", user);
      if (user) {
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className={styles.login}>
      <ul className={styles.tab_base}>
        <li onClick={handleTab("/login/social")}>social 인증</li>
        <li onClick={handleTab("/login/general")}>일반 인증</li>
      </ul>
      {id == "social" && (
        <div className={styles.panel_base}>
          <div className={styles.btn_wrap}>
            <button
              className={styles.google_btn}
              onClick={handleSocialLogin("google")}
            >
              구글 로그인/회원가입
            </button>
            <button
              className={styles.github_btn}
              onClick={handleSocialLogin("github")}
            >
              깃헙 로그인/회원가입
            </button>
            <button
              className={styles.facebook_btn}
              onClick={handleSocialLogin("facebook")}
            >
              페이스북 로그인/회원가입
            </button>
          </div>
        </div>
      )}
      {id == "general" && (
        <div className={styles.panel_base}>
          {authType == "" && (
            <div className={styles.btn_wrap}>
              <button onClick={() => setAuthType("login")}>로그인</button>
              <button onClick={() => setAuthType("signup")}>회원가입</button>
            </div>
          )}
          {authType == "login" && (
            <div className={styles.input_wrap}>
              <form action="">
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button>일반 로그인</button>
              </form>
            </div>
          )}
          {authType == "signup" && (
            <div className={styles.input_wrap}>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button>일반 회원가입</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
