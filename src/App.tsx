import { Outlet } from 'react-router-dom';
import styles from '@/assets/styles/common.module.scss';
import Header from './components/common/Header';

function App() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Header/>
        <Outlet/>
      </div>
    </div>
  );
}

export default App;