import { memo, useCallback } from "react";
import logo from "../../shared/assets/images/logo.png";
import EUGer from "../../shared/assets/images/EUGer.png";
import styles from "./styles/Main.module.scss";
import { InfoBlock } from "./ui/InfoBlock";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useTranslation } from "react-i18next";

const Main = memo(() => {
  const { goTo } = useAppNavigation();
  const { t } = useTranslation();

  const handleSearchClick = useCallback(() => {
    goTo("/search");
  }, [goTo]);

  const handleAnalysesClick = useCallback(() => {
    goTo("/analyses");
  }, [goTo]);

  return (
    <div className={styles.page}>
      <div className={styles["logo-container"]}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <div className={styles["blur-bg"]}></div>
      </div>

      <div className={styles["text-container"]}>
        <div className={styles["text-title"]}>
          <h1 className={styles.title}>{t("main.title")}</h1>
          <img className={styles.flag} src={EUGer} alt="EUGer" />
        </div>
        <p className={styles.description}>
          {t("main.description")}
        </p>
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.primaryButton}
          onClick={handleSearchClick}
        >
          {t("main.searchSpecialist")}
        </button>
        <button
          className={styles.secondaryButton}
          onClick={handleAnalysesClick}
        >
          {t("main.analysisDecoding")}
        </button>
      </div>

      <InfoBlock />
    </div>
  );
});

Main.displayName = "Main";

export default Main;
