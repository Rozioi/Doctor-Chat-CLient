import React, { useState } from "react";
import { Modal, Rate, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../api/api";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import type { Review, TelegramUser } from "../../../api/types";
import { tg } from "../../../shared/lib/telegram";

const { TextArea } = Input;

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  doctorProfileId: number;
  chatId?: number;
  onSuccess?: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  doctorProfileId,
  chatId,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      message.error(t("review.errors.noRating", "Пожалуйста, выберите оценку"));
      return;
    }

    const telegramId =
      user?.telegramId ||
      (tg.initDataUnsafe.user as TelegramUser)?.id?.toString();

    if (!telegramId) {
      message.error(t("review.errors.unknownUser", "Не удалось определить пользователя"));
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.createReview({
        doctorProfileId,
        chatId,
        rating,
        comment: comment.trim() || undefined,
        telegramId,
      });

      if (response.success && response.data) {
        message.success(t("review.success", "Отзыв успешно добавлен"));
        if (onSuccess) {
          onSuccess(response.data);
        }
        handleClose();
      } else {
        message.error(
          response.error || t("review.errors.createError", "Ошибка при создании отзыва"),
        );
      }
    } catch {
      message.error(t("review.errors.createError", "Ошибка при создании отзыва"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Modal
      title={t("review.title", "Оставить отзыв")}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={loading}>
          {t("common.cancel", "Отмена")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={rating === 0}
        >
          {t("review.submit", "Отправить")}
        </Button>,
      ]}
      centered
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ marginBottom: 8 }}>
            {t("review.rating", "Оценка")}:
          </div>
          <Rate
            value={rating}
            onChange={setRating}
            style={{ fontSize: 24 }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>
            {t("review.comment", "Комментарий")} ({t("review.optional", "необязательно")}):
          </div>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("review.commentPlaceholder", "Оставьте ваш отзыв о враче...")}
            rows={4}
            maxLength={500}
            showCount
          />
        </div>
      </div>
    </Modal>
  );
};
