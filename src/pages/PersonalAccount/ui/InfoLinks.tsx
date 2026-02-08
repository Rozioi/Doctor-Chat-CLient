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
  const links = [
    {
      label: t("infoLinks.delivery"),
      icon: <MdArrowForwardIos />,
      link: "pravila_uslug.pdf",
    },
    {
      label: t("infoLinks.paymentProc"),
      icon: <MdArrowForwardIos />,
      link: "pravila_oplaty.pdf",
    },
    {
      label: t("infoLinks.contacts"),
      icon: <MdArrowForwardIos />,
      link: "contacts.pdf",
    },
  ];

  return (
    <div className={styles.linksWrapper}>
      {links.map((item, index) => (
        <button
          key={index}
          onClick={(e) => downloadOffer(e, item.link)}
          className={styles.linkButton}
        >
          <span className={styles.text}>{item.label}</span>
          <span className={styles.iconWrapper}>{item.icon}</span>
        </button>
      ))}
    </div>
  );
};
export default InfoLinks;
