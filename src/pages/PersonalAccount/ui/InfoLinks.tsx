import React from "react";
import styles from "../styles/InfoLinks.module.scss";
import { MdArrowForwardIos } from "react-icons/md";
import { useTranslation } from "react-i18next";

const InfoLinks: React.FC = () => {
  const { t } = useTranslation();
  const URL = import.meta.env.VITE_REACT_APP_PDF_BASE_URL;

  const downloadOffer = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`${URL}${fileName}`, "_blank");
  };

  return (
    <div className={styles.linksWrapper}>
      <button
        onClick={(e) => downloadOffer(e, "n_polzovatelskoe_soglashenie.txt")}
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.userAgreement")}</span>
        <MdArrowForwardIos />
      </button>

      <button
        onClick={(e) => downloadOffer(e, "n_politika_i_soglasie.txt")}
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.privacyPolicy")}</span>
        <MdArrowForwardIos />
      </button>

      <button
        onClick={(e) => downloadOffer(e, "n_pravila_predostavleniya.txt")}
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.delivery")}</span>
        <MdArrowForwardIos />
      </button>

      <button
        onClick={(e) => downloadOffer(e, "n_pravila_oplati.txt")}
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.paymentProc")}</span>
        <MdArrowForwardIos />
      </button>

      {/* БЛОК КОНТАКТОВ ВМЕСТО КНОПКИ */}

      <div className={styles.contactBlock}>
        <h3 className={styles.contactTitle}>MED EXPERT EU</h3>
        <p className={styles.contactText}>
          Есть вопросы или предложения? Мы всегда на связи!
        </p>
        <p className={styles.contactText}>
          Телефон / WhatsApp: <a href="tel:+77022940422">+7 702 294 0422</a>
        </p>
        <p className={styles.contactText}>
          E-mail: <a href="mailto:doctor_chat@mail.ru">doctor_chat@mail.ru</a>
        </p>
      </div>
    </div>
  );
};

export default InfoLinks;
