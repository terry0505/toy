import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { AuthType, SocialProvider } from "@/types/firebase";
import styles from "./Login.module.scss";

function Login() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { socialLogin, login, signup, user, isLoading } = useAuthContext();
  const [authType, setAuthType] = useState<AuthType>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    if (id == undefined) {
      navigate("/login/social");
    }
  }, [id]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading]);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setNickname("");
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
        if (nickname.trim() !== "") {
          signedUser = await signup(email, password, nickname.trim());
        } else {
          signedUser = await signup(email, password);
        }

        console.log("회원가입 결과 : ", signedUser);
      }
      if (user || signedUser) {
        navigate("/");
        queryClient.invalidateQueries({
          queryKey: ["user", "me"]
        });
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
        queryClient.invalidateQueries({
          queryKey: ["user", "me"]
        });
      }
    } catch (error) {}
  };

  return (
    <div>
      <div className={styles.login}>
        <ul className={styles.tab_base}>
          <li onClick={handleTab("/login/social")}>Social 인증</li>
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
                  <div>
                    <button>일반 로그인</button>
                  </div>
                </form>
              </div>
            )}
            {authType == "signup" && (
              <div className={styles.input_wrap}>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="이메일을 입력해주세요. - 필수"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요. - 필수"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="닉네임를 입력해주세요. - 선택"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <div>
                    <button>일반 회원가입</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
