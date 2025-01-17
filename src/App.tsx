import { Outlet } from 'react-router-dom';
import styles from '@/assets/styles/common.module.scss';
import Header from './components/common/Header';

function App() {
  return (
    <div className={styles.wrapper}>
        <Header/>
        <div className={styles.container}>
            <Outlet/>
        </div>
    </div>
  );
}

export default App;