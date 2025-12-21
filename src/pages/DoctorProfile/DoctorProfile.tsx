import type { FC } from "react";
import { useState, useEffect } from "react";
import { Card, Button, message, Select } from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  StarFilled,
} from "@ant-design/icons";
import styles from "./styles/DoctorProfile.module.scss";
import WebApp from "@twa-dev/sdk";
import { useTranslation } from "react-i18next";

interface DoctorProfileProps {
  name: string;
  specialty: string;
  experience: string;
  reviews: string;
  price: string;
  about: string;
  rating: number;
  image: string;
  doctorId?: string | number;
  onBack?: () => void;
  onStartChat?: () => void;
  hasActiveChat?: boolean;
}

export const DoctorProfile: FC<DoctorProfileProps> = ({
  name,
  specialty,
  experience,
  reviews,
  price,
  about,
  rating,
  image,
  doctorId,
  onBack,
  onStartChat,
  hasActiveChat = false,
}) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    try {
      const savedLang =
        (localStorage.getItem("lang") as "ru" | "en" | null) || "ru";
      setLanguage(savedLang === "en" || savedLang === "ru" ? savedLang : "ru");
    } catch {
      // ignore sto rage errors
    }
  }, []);

  const shareProfile = () => {
    const shareText = `${t("chats.doctor", "Врач")}: ${name}\n${t("doctor.profile.specialty", "Специальность")}: ${specialty}\n${t("doctor.profile.rating", "Рейтинг")}: ${rating.toFixed(1)}\n${t("doctor.profile.experience", "Опыт")}: ${experience}\n${t("doctor.profile.price", "Стоимость")}: ${price}`;
    const shareUrl = window.location.href;

    try {
      if (typeof WebApp !== "undefined" && WebApp.openLink) {
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        WebApp.openLink(telegramShareUrl);
      } else if (window.Telegram?.WebApp?.openLink) {
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.Telegram.WebApp.openLink(telegramShareUrl);
      } else {
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(telegramShareUrl, "_blank");
      }
    } catch (error) {
      console.error("Ошибка при попытке поделиться через Telegram:", error);
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramShareUrl, "_blank");
    }
  };

  const handleStartChat = () => {
    if (hasActiveChat) {
      messageApi.warning(
        t(
          "doctor.profile.activeChatExists",
          "У вас уже есть активный чат с этим врачом",
        ),
      );
      return;
    }
    if (onStartChat) {
      onStartChat();
    }
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
        <div className={styles.overlay}>
          <div className={styles.topBar}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className={styles.iconButton}
            />
            <div className={styles.topBarRight}>
              <Select
                value={language === "ru" ? "Русский" : "English"}
                options={[
                  { value: "Русский", label: "Русский" },
                  { value: "English", label: "English" },
                ]}
                onChange={(value) => {
                  if (value === "Русский") {
                    setLanguage("ru");
                    try {
                      localStorage.setItem("lang", "ru");
                    } catch {
                      // ignore
                    }
                    i18n.changeLanguage("ru");
                  } else if (value === "English") {
                    setLanguage("en");
                    try {
                      localStorage.setItem("lang", "en");
                    } catch {
                      // ignore
                    }
                    i18n.changeLanguage("en");
                  }
                }}
                size="small"
                className={styles.languageSelect}
              />
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={shareProfile}
                className={styles.iconButton}
              />
            </div>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.specialty}>
              {t(`doctorRegistration.specializations.${specialty}`)}
            </div>
            <div className={styles.name}>{name}</div>
            <div className={styles.rating}>
              <StarFilled className={styles.star} /> {rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.sectionTitle}>
          {t("doctor.profile.mainInfo", "Основная информация")}
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoBox}>
            <div className={styles.value}>{experience}</div>
            <div className={styles.label}>
              {t("doctor.profile.experience", "стаж")}
            </div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.value}>{reviews}</div>
            <div className={styles.label}>
              {t("doctor.profile.reviews", "отзывов")}
            </div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.value}>{price}</div>
            <div className={styles.label}>
              {t("doctor.profile.price", "стоимость")}
            </div>
          </div>
        </div>

        <div className={styles.aboutSection}>
          <div className={styles.aboutTitle}>
            {t("doctor.profile.about", "О враче")}
          </div>
          <p className={styles.aboutText}>{about}</p>
        </div>

        {onStartChat && (
          <Button
            type="primary"
            size="large"
            block
            className={styles.chatButton}
            onClick={handleStartChat}
            disabled={hasActiveChat}
          >
            {t("doctor.profile.startChat", "Начать чат")}
          </Button>
        )}
      </Card>
    </div>
  );
};
