import type { FC } from "react";
import React, { useState } from "react";
import { Button, message, Select, Modal } from "antd";
import {
  ArrowLeftOutlined,
  HeartOutlined,
  ShareAltOutlined,
  StarOutlined,
} from "@ant-design/icons";
import styles from "./styles/DoctorProfile.module.scss";
import { useTranslation } from "react-i18next";
import { tg } from "../../shared/lib/telegram";
import { useNavigate } from "react-router";

interface DoctorProfileProps {
  id: string | number;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount?: number;
  experience: string;
  qualification: string;
  price: string;
  about?: string;
  image?: string;
  languages?: string[];
  approbationUrl?: string;
  onBack?: () => void;
  onOpenReviews?: () => void;
}

export const DoctorProfile: FC<DoctorProfileProps> = ({
  name,
  specialty,
  rating,
  reviewsCount = 0,
  qualification,
  experience,
  price,
  about,
  image,
  languages = [],
  approbationUrl = "https://doctor-chat-backend-production.up.railway.app/uploads/pdfs/docs-felix-1253.pdf",
  onBack,
  onOpenReviews,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isApprobationVisible, setIsApprobationVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
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
    setIsPaymentModalVisible(true);
  };

  const handlePaymentOption = (option: "KZ" | "RF" | "OTHER") => {
    if (option === "OTHER") {
      messageApi.success(t("paymentSelection.otherText"));
      // Redirect to coordinator after a short delay
      setTimeout(() => {
        window.open("https://t.me/m/ZEH5m-TsMTMy", "_blank");
      }, 2000);
    } else if (option === "KZ") {
      messageApi.info(t("paymentSelection.kzText"));
    } else if (option === "RF") {
      messageApi.info(t("paymentSelection.rfText"));
    }
    setIsPaymentModalVisible(false);
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
                  variant="borderless"
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
            <div className={styles.specialty}>
              {t(
                `doctorRegistration.specializations.${specialty.toLocaleLowerCase()}`,
                `${specialty}`,
              )}
            </div>
            <div
              className={styles.name}
              onClick={() => {
                navigate("/order/20/questionnaire");
              }}
            >
              {name}
            </div>
            <div className={styles.rating}>
              <StarOutlined className={styles.star} />
              {rating.toFixed(1)}
              <span className={styles.reviewsCount}>
                ({reviewsCount} {t("doctor.profile.reviews", "отзывов")})
              </span>
              {onOpenReviews && reviewsCount >= 0 && (
                <button
                  type="button"
                  className={styles.reviewsLink}
                  onClick={onOpenReviews}
                >
                  {t("review.viewAll", "Смотреть все")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.languagesSection}>
          <div className={styles.languagesLabel}>
            {t("doctor.profile.consultationLanguages", "Языки консультаций")}:
          </div>
          <div className={styles.languagesList}>
            {languages.length > 0
              ? languages.join(", ")
              : t("doctor.profile.defaultLanguage", "Русский")}
          </div>
        </div>
        {approbationUrl && (
          <div
            className={styles.approbationLink}
            onClick={() => setIsApprobationVisible(true)}
          >
            {t(
              "doctor.profile.viewApprobation",
              "Посмотреть подтверждающий документ (Approbation)",
            )}
          </div>
        )}

        <div className={styles.aboutSection}>
          <div className={styles.aboutTitle}>
            {t("doctor.profile.about", "О враче")}
          </div>
          <div className={styles.aboutText} style={{ whiteSpace: "pre-line" }}>
            {about || t("doctor.profile.noAbout", "Информация отсутствует")}
          </div>
        </div>
        <div className={styles.experienceBlock}>
          <div className={styles.experienceValue}>{experience}</div>
          <div className={styles.experienceLabel}>
            {t("doctor.profile.experience", "Опыт")}
          </div>
        </div>
        <Button
          type="primary"
          className={styles.chatButton}
          onClick={handleStartChat}
          style={{ marginTop: "24px" }}
        >
          {t("paymentSelection.getExpertise")}
        </Button>
      </div>

      <Modal
        title={t("paymentSelection.title")}
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        footer={null}
        centered
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "8px 0",
          }}
        >
          <Button
            size="large"
            type="default"
            block
            onClick={() => handlePaymentOption("KZ")}
            style={{ height: "auto", padding: "12px", textAlign: "left" }}
          >
            <div style={{ fontWeight: 600 }}>{t("paymentSelection.kz")}</div>
          </Button>
          <Button
            size="large"
            type="default"
            block
            onClick={() => handlePaymentOption("RF")}
            style={{ height: "auto", padding: "12px", textAlign: "left" }}
          >
            <div style={{ fontWeight: 600 }}>{t("paymentSelection.rf")}</div>
          </Button>
          <Button
            size="large"
            type="default"
            block
            onClick={() => handlePaymentOption("OTHER")}
            style={{ height: "auto", padding: "12px", textAlign: "left" }}
          >
            <div style={{ fontWeight: 600 }}>{t("paymentSelection.other")}</div>
          </Button>
        </div>
      </Modal>

      <Modal
        title={t("doctor.profile.approbationTitle", "Подтверждающий документ")}
        open={isApprobationVisible}
        onCancel={() => setIsApprobationVisible(false)}
        footer={null}
        width="90%"
        centered
        className={styles.approbationModal}
      >
        <div className={styles.approbationWrapper}>
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(approbationUrl)}&embedded=true`}
            width="100%"
            height="600px"
            style={{ border: "none" }}
          />
        </div>
      </Modal>
    </div>
  );
};
