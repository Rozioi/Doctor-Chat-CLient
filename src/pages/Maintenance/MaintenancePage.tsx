import React from "react";
import { Button } from "antd";
import { MdConstruction } from "react-icons/md";
import styles from "./styles/MaintenancePage.module.scss";
import { TbRefresh } from "react-icons/tb";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";

export const MaintenancePage: React.FC = () => {
  const { goTo } = useAppNavigation();
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <MdConstruction className={styles.icon} />
        </div>
        <h1 className={styles.title}>Технические работы</h1>
        <p className={styles.description}>
          В данный момент проводятся плановые технические работы. Приносим
          извинения за временные неудобства.
        </p>
        <p className={styles.subtext}>
          Мы делаем всё возможное, чтобы поскорее восстановить работу сервиса.
        </p>

        <Button
          type="primary"
          icon={<TbRefresh />}
          className={styles.retryButton}
          onClick={() => goTo("/")}
        >
          Попробовать снова
        </Button>
      </div>
    </div>
  );
};

export default MaintenancePage;
