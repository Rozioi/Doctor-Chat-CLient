import { useTranslation } from "react-i18next";
import styles from "../styles/InfoWarningBlock.module.scss";

export const InfoWarningBlock = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.infoBlock}>
      <div className={styles.title}>{t("info.warning.title")}</div>
      <div className={styles.text}>{t("info.warning.text1")}</div>
      <div className={styles.textTitle}>{t("info.warning.text2Title")}</div>
      <div className={styles.text}>{t("info.warning.text2")}</div>

      <div className={styles.emergencyTitle}>
        {t("info.warning.emergencyTitle")}
      </div>
      <div className={styles.emergency}>{t("info.warning.emergency")}</div>
    </div>
  );
};
