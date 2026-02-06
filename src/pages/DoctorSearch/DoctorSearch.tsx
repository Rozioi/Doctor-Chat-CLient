import React, { useState, useEffect, useMemo } from "react";
import { Input, List, Button, Spin, message } from "antd";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./styles/DoctorSearch.module.scss";
import { IoIosArrowBack } from "react-icons/io";
import { DoctorCard } from "../../shared/ui/DoctorCard/DoctorCard";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { apiClient } from "../../api/api";
import type { DoctorCardData, DoctorProfile } from "../../api/types";
import { createDoctorSlug } from "../../shared/utils/slug";
import { useTranslation } from "react-i18next";

const preloadDoctorProfile = () =>
  import("../../pages/DoctorProfile/DoctorProfilePage");

const doctorCategories = [
  "gynecologist",
  "ent",
  "neurologist",
  "ophthalmologist",
  "pediatrician",
  "psychiatrist",
  "therapist",
  "dentist",
  "surgeon",
  "cardiologist",
  "dermatologist",
];

const getCountryFlag = (country: string): string => {
  const flags: { [key: string]: string } = {
    Казахстан: "🇰🇿",
    Россия: "🇷🇺",
    Германия: "🇩🇪",
    Франция: "🇫🇷",
    Италия: "🇮🇹",
    США: "🇺🇸",
    Великобритания: "🇬🇧",
  };
  return flags[country] || "🌍";
};

const DoctorSearchPage: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<DoctorCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { goBack, goTo } = useAppNavigation();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDoctors();
        if (response.success && response.data) {
          const formattedDoctors: DoctorCardData[] = response.data.map(
            (doctor) => {
              const doctorProfile = doctor as unknown as DoctorProfile;
              return {
                id: String(doctorProfile.id),
                name: doctorProfile.user
                  ? `${doctorProfile.user.firstName || ""} ${doctorProfile.user.lastName || ""}`.trim() ||
                  doctorProfile.user.username ||
                  "Врач"
                  : "Врач",
                country: doctorProfile.country || "Не указано",
                countryFlag: getCountryFlag(doctorProfile.country || ""),
                rating: doctorProfile.rating ?? 0,
                image:
                  doctorProfile.user?.photoUrl ||
                  "https://i.pravatar.cc/150?img=60",
                category: doctorProfile.specialization || "Специалист",
                specialization: doctorProfile.specialization || "",
              };
            },
          );
          setDoctors(formattedDoctors);
        } else {
          const errorMsg =
            response.error || "Не удалось загрузить список врачей";
          setError(errorMsg);
          messageApi.error(errorMsg);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка при загрузке врачей";
        setError(errorMessage);
        messageApi.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [messageApi, t]);

  const handleToggleCategory = (category: string) => {
    setOpenCategory((prev: string | null) =>
      prev === category ? null : category,
    );
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return doctorCategories;
    const searchLower = search.toLowerCase();
    return doctorCategories.filter((cat) =>
      cat.toLowerCase().includes(searchLower),
    );
  }, [search]);

  return (
    <div className={styles.container}>
      {contextHolder}
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>
      <h2 className={styles.title}>{t("doctor.search.title")}</h2>

      {error && !loading && (
        <div
          style={{
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "8px",
            color: "#cf1322",
          }}
        >
          {error}
        </div>
      )}

      <Input.Search
        placeholder={t("doctor.search.enCatANDName")}
        allowClear
        className={styles.search}
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />

      <List
        dataSource={filteredCategories}
        renderItem={(item: string) => {
          const categoryDoctors = doctors.filter(
            (d: DoctorCardData) =>
              d.specialization === item || d.category === item,
          );

          return (
            <div key={item} className={styles.categoryBlock}>
              <List.Item
                className={`${styles.item} ${openCategory === item ? styles.activeItem : ""}`}
                onClick={() => handleToggleCategory(item)}
              >
                <span>{t(`doctorRegistration.specializations.${item}`)}</span>
                <Button
                  type="text"
                  shape="circle"
                  icon={
                    openCategory === item ? <DownOutlined /> : <RightOutlined />
                  }
                  className={styles.arrow}
                />
              </List.Item>

              {openCategory === item && (
                <div className={styles.doctorList}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Spin />
                    </div>
                  ) : categoryDoctors.length > 0 ? (
                    categoryDoctors.map((doctor: DoctorCardData) => {
                      const doctorSlug = createDoctorSlug(
                        doctor.name,
                        doctor.id,
                      );
                      return (
                        <DoctorCard
                          onSelect={() => goTo(`/doctor/${doctorSlug}`)}
                          onMouseEnter={preloadDoctorProfile}
                          key={doctor.id}
                          {...doctor}
                        />
                      );
                    })
                  ) : (
                    <div className={styles.empty}>
                      {t("doctor.search.noResults")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }}
        className={styles.list}
      />
    </div>
  );
};

export default DoctorSearchPage;
