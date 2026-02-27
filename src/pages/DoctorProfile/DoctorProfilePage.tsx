import React, { useState, useEffect, useCallback } from "react";
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
  reviewsCount: number;
  price: string;
  rating: number;
  image: string;
  about: string;
  languages?: string[];
  approbationUrl?: string;
}

const getExperienceText = (years: number, t: (key: string) => string): string => {
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


  const fetchDoctor = useCallback(async () => {
    let doctorIdStr: string | null = null;

    if (slug) {
      doctorIdStr = extractIdFromSlug(slug);
      if (!doctorIdStr) {
        setError(t("doctorProfilePage.errors.invalidSlug"));
        setLoading(false);
        return;
      }
    } else if (id) {
      doctorIdStr = id;
    } else {
      setError(t("doctorProfilePage.errors.noId"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getDoctorById(doctorIdStr);

      if (response.success && response.data) {
        const doctor = response.data as DoctorProfileType;

        // Подгружаем отзывы для подсчёта
        let reviewsCount = 0;
        try {
          const reviewsResp = await apiClient.getReviewsByDoctor(doctor.id);
          if (reviewsResp.success && reviewsResp.data) {
            reviewsCount = reviewsResp.data.length;
          }
        } catch {
          // тихо игнорируем, рейтинг всё равно есть
        }

        const mappedData: MappedDoctorData = {
          name: doctor.user
            ? `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
              doctor.user.username ||
              t("doctorProfilePage.defaults.doctor")
            : t("doctorProfilePage.defaults.doctor"),
          specialty:
            typeof doctor.specialization === "object"
              ? (doctor.specialization as { name: string })?.name ||
                t("doctorProfilePage.defaults.specialist")
              : (doctor.specialization as string) ||
                t("doctorProfilePage.defaults.specialist"),
          experience: `${Number(doctor.experience || 0)} ${getExperienceText(
            Number(doctor.experience || 0),
            t,
          )}`,
          reviewsCount,
          price: `${Number(doctor.consultationFee || 0).toLocaleString(
            "ru-RU",
          )} ₸`,
          rating: Number(doctor.rating) || 0,
          image: doctor.user?.photoUrl || "https://i.pravatar.cc/300?img=60",
          about: doctor.description || t("doctorProfilePage.defaults.noInfo"),
          languages: doctor.languages,
          approbationUrl: doctor.approbationUrl,
        };

        setDoctorData(mappedData);
        setDoctorId(doctor.id);

        if (user?.id && doctor.user?.id) {
          // checkActiveChat(doctor.user.id);
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
  }, [id, slug, t, user?.id]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

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

  const handleOpenReviews = () => {
    if (slug) {
      goTo(`/doctor/${slug}/reviews`);
    } else if (doctorId) {
      goTo(`/doctor/${String(doctorId)}/reviews`);
    }
  };

  const handleStartChat = (price: number, tariffType: string) => {
    if (doctorId) {
      goTo(
        `/payment?doctorId=${String(doctorId)}&serviceType=consultation&amount=${price}&tariffType=${tariffType}`,
      );
    }
  };

  return (
    <DoctorProfile
      id={doctorId!}
      {...doctorData}
      onOpenReviews={handleOpenReviews}
      reviewsCount={doctorData.reviewsCount}
      onBack={goBack}
      onStartChat={handleStartChat}
    />
  );
};

export default DoctorProfilePage;
