import { useState } from 'react';
import styles from '@/components/game/Gugudan.module.scss';

function Gugudan() {

    // 상태 관리 (문제와 사용자 입력)
    const [first, setFirst] = useState<number>(() => Math.ceil(Math.random() * 9));
    const [second, setSecond] = useState<number>(() => Math.ceil(Math.random() * 9));
    const [inputValue, setInputValue] = useState<string>('');
    const [message, setMessage] = useState<string>('');
  
    // 입력 값 변경 핸들러
    const handleChange = (e) => {
      setInputValue(e.target.value);
    };
  
    // 정답 제출 핸들러
    const handleSubmit = (e) => {
      e.preventDefault(); // 폼 기본 동작 방지
  
      if (parseInt(inputValue) === first * second) {
        setMessage('정답입니다!');
        setFirst(Math.ceil(Math.random() * 9)); // 새로운 문제 생성
        setSecond(Math.ceil(Math.random() * 9));
        setInputValue('');
      } else {
        setMessage('틀렸습니다. 다시 시도해 보세요!');
        setInputValue('');
      }
    };
  
    return (
      <div className={styles.gugudan}>
        <h3>구구단 게임</h3>
        <p className={styles.gugudan__quest}>
          문제: {first} 곱하기 {second}는?
        </p>
        
        <form onSubmit={handleSubmit}>
            <div className={styles.gugudan__answer}>
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="정답 입력"
                />
                <button type="submit">
                    제출
                </button>
            </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  }
export { Gugudan };



