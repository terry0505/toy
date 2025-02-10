import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Gugudan,
  WordRelay,
  NumberBaseball,
  ResponseCheck,
  RSP,
  Lotto,
  Tictactoe,
  MineSearch
} from "@/components/game";
import { useAuthContext } from "@/contexts/AuthContext";

function Game() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      // 인증되지 않은 회원은
      navigate("/login"); // 로그인 페이지로
    }
  }, [user]);

  function GameMatcher(id) {
    if (id == "gugudan") {
      return <Gugudan />;
    } else if (id === "word-relay") {
      return <WordRelay />;
    } else if (id === "number-baseball") {
      return <NumberBaseball />;
    } else if (id === "response-check") {
      return <ResponseCheck />;
    } else if (id === "rsp") {
      return <RSP />;
    } else if (id === "lotto") {
      return <Lotto />;
    } else if (id === "tictactoe") {
      return <Tictactoe />;
    } else if (id === "mine-search") {
      return <MineSearch />;
    }
  }

  return <>{GameMatcher(id)}</>;
}

export default Game;
