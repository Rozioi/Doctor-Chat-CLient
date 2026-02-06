import React from "react";
import styles from "../styles/InfoLinks.module.scss";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const InfoLinks: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const links = [
    {
      label: t("infoLinks.delivery"),
      icon: <MdArrowForwardIos />,
      link: "delivery",
    },
    {
      label: t("infoLinks.paymentProc"),
      icon: <MdArrowForwardIos />,
      link: "infoLinks.paymentProc",
    },
    {
      label: t("infoLinks.contacts"),
      icon: <MdArrowForwardIos />,
      link: "contacts",
    },
    {
      label: t("infoLinks.aboutServices"),
      icon: <MdArrowForwardIos />,
      link: "services",
    },
  ];

  return (
    <div className={styles.linksWrapper}>
      {links.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(`/${item.link}`)}
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
