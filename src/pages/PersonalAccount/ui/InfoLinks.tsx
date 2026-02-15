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
        onClick={(e) =>
          downloadOffer(e, "user-agreement-public-offer-med-expert-eu.pdf")
        }
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.userAgreement")}</span>
        <MdArrowForwardIos />
      </button>

      <button
        onClick={(e) =>
          downloadOffer(e, "privacy-policy-and-consent-to-data-processing.pdf")
        }
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.privacyPolicy")}</span>
        <MdArrowForwardIos />
      </button>

      <button
        onClick={(e) =>
          downloadOffer(e, "information-services-terms-med-expert-eu.pdf")
        }
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.delivery")}</span>
        <MdArrowForwardIos />
      </button>

      <button
        onClick={(e) =>
          downloadOffer(e, "payment-and-refund-policy-med-expert-eu.pdf")
        }
        className={styles.linkButton}
      >
        <span className={styles.text}>{t("infoLinks.paymentProc")}</span>
        <MdArrowForwardIos />
      </button>

      <div className={styles.contactBlock}>
        <h3 className={styles.contactTitle}>{t("contact.title")}</h3>
        <p className={styles.contactText}>{t("contact.text1")}</p>
        <p className={styles.contactText}>
          {t("contact.phone", { phone: "+7 702 294 0422" })}
        </p>
        <p className={styles.contactText}>
          {t("contact.email", { email: "doctor_chat@mail.ru" })}
        </p>
      </div>
    </div>
  );
};

export default InfoLinks;
