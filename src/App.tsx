import { Outlet } from 'react-router-dom';
import styles from '@/assets/styles/common.module.scss';
import Header from './components/common/Header';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthContextProvider>
        <div className={styles.wrapper}>
            <Header/>
            <div className={styles.container}>
                <Outlet/>
            </div>
        </div>
    </AuthContextProvider>
  );
}

export default App;