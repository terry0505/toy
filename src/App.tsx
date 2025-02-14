import { Outlet } from "react-router-dom";
import toastr from "toastr";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import styles from "@/assets/styles/common.module.scss";
import Header from "./components/common/Header";
import { AuthContextProvider } from "./contexts/AuthContext";
import "toastr/build/toastr.min.css";

dayjs.locale('ko');
dayjs.extend(relativeTime);

toastr.options = {
  timeOut: 2000,
  positionClass: "toast-bottom-center"
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryOnMount: true,
      refetchOnReconnect: false,
      retry: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <div className={styles.wrapper}>
          <Header />
          <div className={styles.container}>
            <Outlet />
          </div>
        </div>
      </AuthContextProvider>
      <ReactQueryDevtools
        initialIsOpen={import.meta.env.VITE_PUBLIC_MODE === "local"}
      />
    </QueryClientProvider>
  );
}

export default App;
