import type { FC } from "react";
import { useState } from "react";
import { Button, message, Select } from "antd";
import {
  ArrowLeftOutlined,
  HeartOutlined,
  ShareAltOutlined,
  StarOutlined,
} from "@ant-design/icons";
import styles from "./styles/DoctorProfile.module.scss";
import { useTranslation } from "react-i18next";
import { tg } from "../../shared/lib/telegram";

interface DoctorProfileProps {
  id: string | number;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount?: number;
  experience: string;
  price: string;
  about?: string;
  image?: string;
  onBack?: () => void;
  onStartChat?: () => void;
}

export const DoctorProfile: FC<DoctorProfileProps> = ({
  name,
  specialty,
  rating,
  reviewsCount = 0,
  experience,
  price,
  about,
  image,
  onBack,
  onStartChat,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [, contextHolder] = message.useMessage();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setSelectedLanguage(value);
  };

  const shareProfile = () => {
    const shareText = `${t("chats.doctor", "Врач")}: ${name}\n${t("doctor.profile.specialty", "Специальность")}: ${specialty}\n${t("doctor.profile.rating", "Рейтинг")}: ${rating.toFixed(1)}\n${t("doctor.profile.experience", "Опыт")}: ${experience}\n${t("doctor.profile.price", "Стоимость")}: ${price}`;
    const shareUrl = window.location.href;

    try {
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((tg as any).openLink) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (tg as any).openLink(telegramShareUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((window as any).Telegram?.WebApp?.openLink) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).Telegram.WebApp.openLink(telegramShareUrl);
      } else {
        window.open(telegramShareUrl, "_blank");
      }
    } catch (error) {
      console.error("Ошибка при попытке поделиться через Telegram:", error);
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramShareUrl, "_blank");
    }
  };

  const handleStartChat = () => {
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
              icon={<ArrowLeftOutlined />}
              className={styles.iconButton}
              onClick={onBack}
            />
            <div className={styles.topBarRight}>
              <div className={styles.languageSelect}>
                <Select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  size="small"
                  bordered={false}
                  options={[
                    { value: "ru", label: "RU" },
                    { value: "en", label: "EN" },
                  ]}
                />
              </div>
              <Button
                icon={<ShareAltOutlined />}
                className={styles.iconButton}
                onClick={shareProfile}
              />
              <Button icon={<HeartOutlined />} className={styles.iconButton} />
            </div>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.specialty}>{specialty}</div>
            <div className={styles.name}>{name}</div>
            <div className={styles.rating}>
              <StarOutlined className={styles.star} />
              {rating.toFixed(1)}
              <span className={styles.reviewsCount}>
                ({reviewsCount} {t("doctor.profile.reviews", "отзывов")})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.infoRow}>
          <div className={styles.infoBox}>
            <div className={styles.value}>{experience}</div>
            <div className={styles.label}>
              {t("doctor.profile.experience", "Опыт")}
            </div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.value}>{price}</div>
            <div className={styles.label}>
              {t("doctor.profile.price", "Стоимость")}
            </div>
          </div>
        </div>

        <div className={styles.aboutSection}>
          <div className={styles.aboutTitle}>
            {t("doctor.profile.about", "О враче")}
          </div>
          <div className={styles.aboutText}>
            {about || t("doctor.profile.noAbout", "Информация отсутствует")}
          </div>
        </div>

        <Button
          type="primary"
          className={styles.chatButton}
          onClick={handleStartChat}
        >
          {t("doctor.profile.startChat", "Начать чат")}
        </Button>
      </div>
    </div>
  );
};
