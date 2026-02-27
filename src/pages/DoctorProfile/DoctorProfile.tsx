import type { FC } from "react";
import { useState } from "react";
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
  languages?: string[];
  approbationUrl?: string;
  onBack?: () => void;
  onStartChat?: (tariffPrice: number, tariffType: "STANDARD" | "VIP") => void;
  onOpenReviews?: () => void;
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
  languages = [],
  approbationUrl,
  onBack,
  onStartChat,
  onOpenReviews,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [selectedTariff, setSelectedTariff] = useState<"STANDARD" | "VIP">(
    "STANDARD",
  );
  const [isApprobationVisible, setIsApprobationVisible] = useState(false);
  const [, contextHolder] = message.useMessage();

  const tariffs = [
    {
      id: "STANDARD",
      name: t("doctor.profile.tariffs.standard.name", "СТАНДАРТ"),
      price: 65000,
      features: [
        t(
          "doctor.profile.tariffs.standard.f1",
          "Письменное заключение Европейского Эксперта",
        ),
        t(
          "doctor.profile.tariffs.standard.f2",
          "Разбор вашей истории болезни и анализов",
        ),
        t(
          "doctor.profile.tariffs.standard.f3",
          "Чат с врачом (Экспертная сессия на русском языке)",
        ),
      ],
    },
    {
      id: "VIP",
      name: t("doctor.profile.tariffs.vip.name", "VIP (ПОД КЛЮЧ)"),
      price: 85000,
      isRecommended: true,
      features: [
        t("doctor.profile.tariffs.vip.f1", "Всё, что входит в тариф Стандарт"),
        t(
          "doctor.profile.tariffs.vip.f2",
          "+ Услуга «Адаптация»: Организация визита к врачу-партнеру MED EXPERT в вашем городе",
        ),
        t(
          "doctor.profile.tariffs.vip.f3",
          "+ Оплата 1-го визита включена: Вам не нужно платить в кассе клиники за первичный прием",
        ),
        t(
          "doctor.profile.tariffs.vip.f4",
          "+ «Зеленый коридор»: Приоритетная запись к специалисту через координатора",
        ),
      ],
    },
  ];

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
      const tariff = tariffs.find((t) => t.id === selectedTariff);
      if (tariff) {
        onStartChat(tariff.price, selectedTariff);
      }
    }
  };

  const currentPrice =
    tariffs.find((t) => t.id === selectedTariff)?.price || 50000;

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
            <div className={styles.name}>{name}</div>
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
          <div className={styles.aboutText}>
            {about || t("doctor.profile.noAbout", "Информация отсутствует")}
          </div>
        </div>

        <div className={styles.experienceBlock}>
          <div className={styles.experienceValue}>{experience}</div>
          <div className={styles.experienceLabel}>
            {t("doctor.profile.experience", "Опыт")}
          </div>
        </div>

        <div className={styles.tariffsSection}>
          <div className={styles.aboutTitle}>
            {t("doctor.profile.tariffs.title", "Выберите тариф")}
          </div>
          <div className={styles.tariffsList}>
            {tariffs.map((tariff) => (
              <div
                key={tariff.id}
                className={`${styles.tariffItem} ${selectedTariff === tariff.id ? styles.selected : ""} ${tariff.isRecommended ? styles.recommended : ""}`}
                onClick={() =>
                  setSelectedTariff(tariff.id as "STANDARD" | "VIP")
                }
              >
                {tariff.isRecommended && (
                  <div className={styles.recommendedBadge}>
                    {t("doctor.profile.tariffs.recommended", "Рекомендуем")}
                  </div>
                )}
                <div className={styles.tariffHeader}>
                  <div className={styles.tariffName}>{tariff.name}</div>
                  <div className={styles.tariffPrice}>
                    {tariff.price.toLocaleString("ru-RU")} ₸
                  </div>
                </div>
                <ul className={styles.featuresList}>
                  {tariff.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="primary"
          className={styles.chatButton}
          onClick={handleStartChat}
        >
          {t("doctor.profile.startChatWithPrice", "Начать чат за {{price}} ₸", {
            price: currentPrice.toLocaleString("ru-RU"),
          })}
        </Button>
      </div>

      <Modal
        title={t("doctor.profile.approbationTitle", "Подтверждающий документ")}
        open={isApprobationVisible}
        onCancel={() => setIsApprobationVisible(false)}
        footer={null}
        width="90%"
        centered
        className={styles.approbationModal}
      >
        <div className={styles.approbationImageWrapper}>
          <img
            src={approbationUrl}
            alt="Approbation"
            className={styles.approbationImage}
          />
        </div>
      </Modal>
    </div>
  );
};
