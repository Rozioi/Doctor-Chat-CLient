import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { NavBottomPanel } from "../shared/ui/NavBottomPanel/NavBottomPanel";
import styles from "../shared/assets/styles/MainLayout.module.scss";
import { apiClient } from "../api/api";
import { useAppNavigation } from "../shared/hooks/useAppNavigation";
import { Loader } from "../shared/ui/Loader/Loader";

export const MainLayout = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);



  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;
    if (prev === "/onboarding" && curr !== "/onboarding") {
      localStorage.setItem("onboardingSeen", "true");
    }

    prevPathRef.current = curr;
  }, [location.pathname]);
  const { goTo } = useAppNavigation();
  useEffect(() => {
    const checkServer = async () => {
      const res = await apiClient.checkedServer();

      if (!res.success) {
        goTo("tech");
        return;
      }
    };

    checkServer();
  }, [goTo]);

  return (
    <Suspense fallback={<Loader fullScreen text="Загрузка..." size="medium" />}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Outlet />
        </div>

        <div className={styles.nav}>
          <NavBottomPanel />
        </div>
      </div>
    </Suspense>
  );
};
