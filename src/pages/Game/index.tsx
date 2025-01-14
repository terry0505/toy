import { useParams } from 'react-router-dom';
import {
  Gugudan,
  WordRelay,
  NumberBaseball,
  ResponseCheck,
  RSP,
  Lotto,
  Tictactoe,
  MineSearch,
} from '@/components/game';

function Game() {
  const { id } = useParams();
  function GameMatcher(id) {
    if (id == 'gugudan') {
      return <Gugudan />;
    } else if (id === 'word-relay') {
      return <WordRelay />;
    } else if (id === 'number-baseball') {
      return <NumberBaseball />;
    } else if (id === 'response-check') {
      return <ResponseCheck />;
    } else if (id === 'rsp') {
      return <RSP />;
    } else if (id === 'lotto') {
      return <Lotto />;
    } else if (id === 'tictactoe') {
      return <Tictactoe />;
    } else if (id === 'mine-search') {
      return <MineSearch />;
    }
  }

  return (
    <>
      {GameMatcher(id)}
    </>
  );
}

export default Game;