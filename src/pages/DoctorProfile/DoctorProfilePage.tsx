import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { DoctorProfile } from "./DoctorProfile";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { apiClient } from "../../api/api";
import { Loader } from "../../shared/ui/Loader/Loader";
import type { DoctorProfile as DoctorProfileType } from "../../api/types";
import { extractIdFromSlug } from "../../shared/utils/slug";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface MappedDoctorData {
  name: string;
  specialty: string;
  experience: string;
  reviews: string;
  price: string;
  rating: number;
  image: string;
  about: string;
}

const getExperienceText = (years: number, t: any): string => {
  if (years === 1) return t("doctorProfilePage.experience.year");
  if (years >= 2 && years <= 4)
    return t("doctorProfilePage.experience.years2_4");
  return t("doctorProfilePage.experience.years5plus");
};

export const DoctorProfilePage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const { goBack, goTo } = useAppNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<MappedDoctorData | null>(null);
  const [doctorId, setDoctorId] = useState<string | number | null>(null);
  const [hasActiveChat, setHasActiveChat] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      let doctorId: string | null = null;

      if (slug) {
        doctorId = extractIdFromSlug(slug);
        if (!doctorId) {
          setError(t("doctorProfilePage.errors.invalidSlug"));
          setLoading(false);
          return;
        }
      } else if (id) {
        doctorId = id;
      } else {
        setError(t("doctorProfilePage.errors.noId"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDoctorById(doctorId);

        if (response.success && response.data) {
          const doctor = response.data as DoctorProfileType;
          const mappedData: MappedDoctorData = {
            name: doctor.user
              ? `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
                doctor.user.username ||
                t("doctorProfilePage.defaults.doctor")
              : t("doctorProfilePage.defaults.doctor"),
            specialty:
              typeof doctor.specialization === "object"
                ? (doctor.specialization as any)?.name ||
                  t("doctorProfilePage.defaults.specialist")
                : doctor.specialization ||
                  t("doctorProfilePage.defaults.specialist"),
            experience: `${Number(doctor.experience || 0)} ${getExperienceText(
              Number(doctor.experience || 0),
              t,
            )}`,
            reviews: "0",
            price: `${Number(doctor.consultationFee || 0).toLocaleString("ru-RU")} ₸`,
            rating: Number(doctor.rating) || 0,
            image: doctor.user?.photoUrl || "https://i.pravatar.cc/300?img=60",
            about: doctor.description || t("doctorProfilePage.defaults.noInfo"),
          };

          setDoctorData(mappedData);
          setDoctorId(doctor.id);

          // Проверяем активный чат
          if (user?.id && doctor.user?.id) {
            checkActiveChat(doctor.user.id);
          }
        } else {
          setError(response.error || t("doctorProfilePage.errors.notFound"));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : t("doctorProfilePage.errors.loadError");
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const checkActiveChat = async (doctorUserId: number) => {
      try {
        const telegramId =
          user?.telegramId ||
          window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
        if (!telegramId) return;

        const response = await apiClient.getChats(telegramId);
        if (response.success && response.data) {
          const activeChat = response.data.find(
            (chat) =>
              chat.status === "ACTIVE" &&
              chat.doctorId === doctorUserId &&
              chat.serviceType === "consultation",
          );
          setHasActiveChat(!!activeChat);
        }
      } catch (err) {
        console.error(t("doctorProfilePage.errors.checkChatError"), err);
      }
    };

    fetchDoctor();
  }, [id, slug, user]);

  if (loading) {
    return (
      <Loader fullScreen text={t("doctorProfilePage.loading")} size="large" />
    );
  }

  if (error || !doctorData) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <p style={{ fontSize: "16px", color: "#666" }}>
          {error || t("doctorProfilePage.errors.notFound")}
        </p>
        <button
          onClick={goBack}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {t("common.back")}
        </button>
      </div>
    );
  }

  const handleStartChat = () => {
    if (doctorId) {
      goTo(`/payment?doctorId=${String(doctorId)}&serviceType=consultation`);
    }
  };

  return (
    <DoctorProfile
      {...doctorData}
      doctorId={doctorId || undefined}
      onBack={goBack}
      onStartChat={handleStartChat}
      hasActiveChat={hasActiveChat}
    />
  );
};
