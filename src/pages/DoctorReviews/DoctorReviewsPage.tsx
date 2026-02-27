import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Rate, Card, Typography, Empty, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../api/api";
import type { DoctorProfile as DoctorProfileType, Review } from "../../api/types";
import { extractIdFromSlug } from "../../shared/utils/slug";
import { Loader } from "../../shared/ui/Loader/Loader";
import styles from "./styles/DoctorReviewsPage.module.scss";

const { Title, Text } = Typography;

export const DoctorReviewsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setError(t("doctorProfilePage.errors.invalidSlug"));
        setLoading(false);
        return;
      }

      const doctorIdStr = extractIdFromSlug(slug);
      if (!doctorIdStr) {
        setError(t("doctorProfilePage.errors.invalidSlug"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [doctorResp, reviewsResp] = await Promise.all([
          apiClient.getDoctorById(doctorIdStr),
          // doctorId в отзывах — это doctorProfileId
          apiClient.getReviewsByDoctor(Number(doctorIdStr)),
        ]);

        if (doctorResp.success && doctorResp.data) {
          setDoctor(doctorResp.data as DoctorProfileType);
        } else {
          setError(
            doctorResp.error || t("doctorProfilePage.errors.notFound"),
          );
        }

        if (reviewsResp.success && reviewsResp.data) {
          setReviews(reviewsResp.data);
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : t("doctorProfilePage.errors.loadError"),
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, t]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Loader fullScreen text={t("doctorProfilePage.loading")} size="large" />
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <Text type="danger">{error}</Text>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          {t("common.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          icon={<ArrowLeftOutlined />}
          className={styles.iconButton}
          onClick={handleBack}
        />
        <div className={styles.headerInfo}>
          <Title level={4} className={styles.doctorName}>
            {doctor?.user
              ? `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
                doctor.user.username ||
                t("doctorProfilePage.defaults.doctor")
              : t("doctorProfilePage.defaults.doctor")}
          </Title>
          <div className={styles.ratingRow}>
            <Rate
              disabled
              allowHalf
              defaultValue={Number(doctor?.rating || 0)}
            />
            <Text className={styles.ratingValue}>
              {Number(doctor?.rating || 0).toFixed(1)}
            </Text>
            <Text type="secondary" className={styles.reviewsCount}>
              ({reviews.length} {t("doctor.profile.reviews", "отзывов")})
            </Text>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {reviews.length === 0 ? (
          <Empty
            description={t("review.empty", "У этого врача пока нет отзывов")}
          />
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.patientInfo}>
                  <div className={styles.avatar}>
                    {review.patient?.firstName?.[0] ||
                      review.patient?.username?.[0] ||
                      "П"}
                  </div>
                  <div>
                    <div className={styles.patientName}>
                      {review.patient?.firstName ||
                        review.patient?.username ||
                        t("doctorProfilePage.defaults.doctor")}
                    </div>
                    <div className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                </div>
                <Rate disabled allowHalf defaultValue={review.rating} />
              </div>
              {review.comment && (
                <div className={styles.reviewComment}>{review.comment}</div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorReviewsPage;

