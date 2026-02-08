import { memo, useCallback, useState } from "react";
import logo from "../../shared/assets/images/logo.png";
import EUGer from "../../shared/assets/images/EUGer.png";
import styles from "./styles/Main.module.scss";
import { InfoBlock } from "./ui/InfoBlock";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useTranslation } from "react-i18next";
import { AdaptationModal } from "../../shared/ui/AdaptationModal/AdaptationModal";

const Main = memo(() => {
  const { goTo } = useAppNavigation();
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSearchClick = useCallback(() => {
    goTo("/search");
  }, [goTo]);

  const handleSecondStepClick = useCallback(() => {
    setIsOpenModal((prevState) => !prevState);
  }, [isOpenModal]);

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
        <p className={styles.description}>{t("main.description")}</p>
      </div>

      <div className={styles.buttons}>
        <button className={styles.primaryButton} onClick={handleSearchClick}>
          {t("main.searchSpecialist")}
        </button>
        <button
          className={styles.secondaryButton}
          onClick={handleSecondStepClick}
        >
          {t("main.analysisDecoding")}
        </button>
      </div>

      <InfoBlock />
      <AdaptationModal
        open={isOpenModal}
        onClose={() => setIsOpenModal(!isOpenModal)}
      />
    </div>
  );
});

Main.displayName = "Main";

export default Main;
