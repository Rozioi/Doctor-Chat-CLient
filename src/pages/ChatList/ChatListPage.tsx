import React, { useState, useEffect, useCallback } from "react";
import { List, Avatar, Card, Typography, Spin, message, Button } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import type { Chat, Review, TelegramUser } from "../../api/types";
import { tg } from "../../shared/lib/telegram";
import styles from "./styles/ChatListPage.module.scss";
import { useTranslation } from "react-i18next";
import { ReviewModal } from "../../shared/ui/ReviewModal/ReviewModal";

const { Title, Text } = Typography;

const ChatListPage: React.FC = () => {
  const { goBack } = useAppNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [reviews, setReviews] = useState<Record<number, Review>>({});
  const [messageApi, contextHolder] = message.useMessage();

  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      const telegramId =
        user?.telegramId ||
        (tg.initDataUnsafe.user as TelegramUser)?.id?.toString();

      if (!telegramId) {
        messageApi.error(
          t("chats.errors.unknownUser", "Не удалось определить пользователя"),
        );
        setLoading(false);
        return;
      }

      const response = await apiClient.getChats(telegramId);
      if (response.success && response.data) {
        const visibleChats = response.data.filter(
          (chat) => chat.status === "ACTIVE" || chat.status === "COMPLETED",
        );
        setChats(visibleChats);

        const completedChats = response.data.filter(
          (chat) => chat.status === "COMPLETED",
        );
        for (const chat of completedChats) {
          if (chat.id) {
            const reviewResponse = await apiClient.getReviewByChat(chat.id);
            if (reviewResponse.success && reviewResponse.data) {
              setReviews((prev: Record<number, Review>) => ({
                ...prev,
                [chat.id]: reviewResponse.data!,
              }));
            }
          }
        }
      } else {
        messageApi.error(
          response.error ||
            t("chats.errors.loadError", "Не удалось загрузить чаты"),
        );
      }
    } catch {
      messageApi.error(
        t("chats.errors.loadError", "Ошибка при загрузке чатов"),
      );
    } finally {
      setLoading(false);
    }
  }, [user?.telegramId, messageApi, t]);

  const handleOpenChat = (chat: Chat) => {
    try {
      const targetUser =
        user?.role === "DOCTOR" ? chat.patient : chat.doctor || undefined;

      if (!targetUser) {
        messageApi.error(
          t(
            "chats.errors.openError",
            "Не удалось открыть чат в Telegram (нет данных пользователя)",
          ),
        );
        return;
      }

      const botUsername = import.meta.env.VITE_BOT_USERNAME || "LumoMarket_bot";
      const url = `https://t.me/${botUsername}?start=chat_${chat.id}`;

      openTelegramLink(url);
    } catch (error) {
      console.error("Ошибка при открытии чата:", error);
      messageApi.error(
        t("chats.errors.openError", "Не удалось открыть чат в Telegram"),
      );
    }
  };

  const openTelegramLink = (url: string) => {
    const isTgProtocol = url.startsWith("tg://");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isTgProtocol && (tg as any).openLink) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (tg as any).openLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const getChatTitle = (chat: Chat) => {
    if (user?.role === "DOCTOR") {
      return chat.patient
        ? `${chat.patient.firstName || ""} ${chat.patient.lastName || ""}`.trim() ||
            chat.patient.username ||
            t("chats.patient", "Пациент")
        : t("chats.patient", "Пациент");
    } else {
      return chat.doctor
        ? `${chat.doctor.firstName || ""} ${chat.doctor.lastName || ""}`.trim() ||
            chat.doctor.username ||
            t("chats.doctor", "Врач")
        : t("chats.doctor", "Врач");
    }
  };

  const getChatAvatar = (chat: Chat) => {
    if (user?.role === "DOCTOR") {
      return chat.patient?.photoUrl || "https://i.pravatar.cc/150?img=60";
    } else {
      return chat.doctor?.photoUrl || "https://i.pravatar.cc/150?img=60";
    }
  };

  const getServiceTypeText = (serviceType: string) => {
    return serviceType === "analysis"
      ? t("chats.analysis", "Расшифровка анализов")
      : t("chats.consultation", "Консультация");
  };

  const getDoctorProfileId = (chat: Chat): number | null => {
    if (chat.doctor?.doctorProfile?.id) {
      return chat.doctor.doctorProfile.id;
    }

    return null;
  };

  const handleReviewClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    const doctorProfileId = getDoctorProfileId(chat);
    if (!doctorProfileId) {
      messageApi.error(
        t("review.errors.doctorNotFound", "Не удалось найти профиль врача"),
      );
      return;
    }
    setSelectedChat(chat);
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = (review: Review) => {
    if (selectedChat) {
      setReviews((prev: Record<number, Review>) => ({
        ...prev,
        [selectedChat.id]: review,
      }));
    }
    setReviewModalOpen(false);
    setSelectedChat(null);
  };

  const handleCompleteChat = async (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    try {
      const response = await apiClient.completeChat(
        chat.id,
        user?.telegramId || "",
      );
      if (response.success) {
        messageApi.success(
          t("chats.success.completed", "Консультация успешно завершена"),
        );
        loadChats();
      } else {
        messageApi.error(
          response.error ||
            t(
              "chats.errors.completeError",
              "Не удалось завершить консультацию",
            ),
        );
      }
    } catch (error) {
      messageApi.error(
        t("chats.errors.completeError", "Ошибка при завершении консультации"),
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>

      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {user?.role === "DOCTOR"
            ? t("chats.myPatients", "Мои пациенты")
            : t("chats.myDoctors", "Мои врачи")}
        </Title>

        {chats.length === 0 ? (
          <div className={styles.empty}>
            <MessageOutlined className={styles.emptyIcon} />
            <Text className={styles.emptyText}>
              {user?.role === "DOCTOR"
                ? t("chats.emptyDoctor", "У вас пока нет пациентов")
                : t("chats.empty", "У вас пока нет чатов с врачами")}
            </Text>
          </div>
        ) : (
          <List
            dataSource={chats}
            renderItem={(chat: Chat) => (
              <List.Item
                className={styles.chatItem}
                onClick={() => {
                  if (chat.status === "ACTIVE") {
                    handleOpenChat(chat);
                  } else if (
                    chat.status === "COMPLETED" &&
                    user?.role === "PATIENT" &&
                    !reviews[chat.id]
                  ) {
                    // Для пациента: сразу открываем модалку отзыва
                    const doctorProfileId = getDoctorProfileId(chat);
                    if (!doctorProfileId) {
                      messageApi.error(
                        t(
                          "review.errors.doctorNotFound",
                          "Не удалось найти профиль врача",
                        ),
                      );
                      return;
                    }
                    setSelectedChat(chat);
                    setReviewModalOpen(true);
                  } else if (chat.status === "COMPLETED") {
                    // Для врача или при уже оставленном отзыве — просто подсказка
                    messageApi.info(
                      t(
                        "chats.info.completedReadOnly",
                        "Эта консультация завершена и доступна только для чтения в Telegram",
                      ),
                    );
                  }
                }}
                actions={
                  chat.status === "COMPLETED" &&
                  !reviews[chat.id] &&
                  user?.role === "PATIENT"
                    ? [
                        <Button
                          key="review"
                          type="link"
                          icon={<StarOutlined />}
                          onClick={(e: React.MouseEvent) =>
                            handleReviewClick(e, chat)
                          }
                          size="small"
                        >
                          {t("review.leaveReview", "Оставить отзыв")}
                        </Button>,
                      ]
                    : chat.status === "ACTIVE" && user?.role === "DOCTOR"
                      ? [
                          <Button
                            key="complete"
                            type="primary"
                            danger
                            onClick={(e: React.MouseEvent) =>
                              handleCompleteChat(e, chat)
                            }
                            size="small"
                          >
                            {t("chats.complete", "Завершить")}
                          </Button>,
                        ]
                      : []
                }
              >
                <div className={styles.chatItemInner}>
                  <Avatar
                    src={getChatAvatar(chat)}
                    size={50}
                    className={styles.avatar}
                  />
                  <div className={styles.chatContent}>
                    <div className={styles.chatHeader}>
                      <Text strong className={styles.chatTitleText}>
                        {getChatTitle(chat)}
                      </Text>
                      <span className={styles.statusPill}>
                        {chat.status === "ACTIVE"
                          ? t("chats.active", "Активен")
                          : chat.status === "COMPLETED"
                            ? t("chats.completed", "Завершен")
                            : t("chats.cancelled", "Отменен")}
                      </span>
                    </div>
                    <Text className={styles.serviceType}>
                      {getServiceTypeText(chat.serviceType)}
                    </Text>
                    <div className={styles.chatFooter}>
                      <Text className={styles.amount}>
                        {Number(chat.amount).toLocaleString("ru-RU")} ₸
                      </Text>
                      <Text className={styles.date}>
                        {new Date(chat.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>

      {selectedChat && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedChat(null);
          }}
          doctorProfileId={getDoctorProfileId(selectedChat) || 0}
          chatId={selectedChat.id}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default ChatListPage;
