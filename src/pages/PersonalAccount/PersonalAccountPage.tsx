import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Modal,
  List,
  Tag,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import DoctorProfileSection from "./ui/Doctor/DoctorProfileSection";

import styles from "./styles/PersonalAccountPage.module.scss";
import ProfileUpload from "./ui/ProfileUpload";
import InfoLinks from "./ui/InfoLinks";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import type { Payment } from "../../api/types";
import { Loader } from "../../shared/ui/Loader/Loader";
const { Title, Text } = Typography;

const PersonalAccountPage: React.FC = () => {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [pageLoading, setPageLoading] = useState(() => {
    const hasUser = !!localStorage.getItem("user");
    const isDoctor =
      JSON.parse(localStorage.getItem("user") || "{}")?.role === "DOCTOR";
    const hasDoctorProfile = !!localStorage.getItem("doctorProfile");

    if (hasUser && (!isDoctor || hasDoctorProfile)) {
      return false;
    }
    return true;
  });
  const [balance, setBalance] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [card] = useState("Visa **** 9399");
  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const [doctorProfile, setDoctorProfile] = useState<{
    id: number;
    consultationFee: number | string;
    description: string;
    specialization: string;
    languages?: string[];
  } | null>(() => {
    try {
      const saved = localStorage.getItem("doctorProfile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { goBack } = useAppNavigation();

  useEffect(() => {
    try {
      const savedLang =
        (localStorage.getItem("lang") as "ru" | "en" | null) || "ru";
      setLanguage(savedLang === "en" || savedLang === "ru" ? savedLang : "ru");
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;

      if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPatronymic(user.patronymic || "");
      setPhone(user.phoneNumber || "");

      const init = async () => {
        try {
          if (user.role === "DOCTOR" && user.id) {
            await loadDoctorProfile(user.id);
          }

          // загрузка баланса и платежей
          const telegramId =
            user.telegramId ||
            window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
          if (telegramId) {
            const [balanceResp, paymentsResp] = await Promise.all([
              apiClient.getBalance(telegramId),
              apiClient.getPayments(telegramId),
            ]);

            if (balanceResp.success && balanceResp.data) {
              setBalance(Number(balanceResp.data.amount || 0));
            }

            if (paymentsResp.success && paymentsResp.data) {
              setPayments(paymentsResp.data);
            }
          }
        } finally {
          setPageLoading(false);
        }
      };

      init();
    } else {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
        setFirstName(telegramUser.first_name || "");
        setLastName(telegramUser.last_name || "");
        setPatronymic("");
      }
      setPageLoading(false);
    }
  }, [user, t, isAuthLoading]);

  const loadDoctorProfile = async (userId: string | number) => {
    try {
      const response = await apiClient.getDoctorByUserId(userId);
      if (response.success && response.data) {
        console.log(response.data);
        setDoctorProfile(response.data);
        localStorage.setItem("doctorProfile", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmDelete = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      messageApi.success(t("profile.deleteSuccess"));
      setShowLogoutModal(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
      messageApi.error(t("profile.deleteError"));
    } finally {
      setLogoutLoading(false);
    }
  };
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      messageApi.success(t("profile.logoutSuccess"));
      setShowLogoutModal(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
      messageApi.error(t("profile.logoutSuccess"));
      setShowLogoutModal(false);
      navigate("/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.telegramId) return;

    setIsSaving(true);
    try {
      const response = await apiClient.updateUser(user.telegramId, {
        firstName,
        lastName,
        patronymic,
        phoneNumber: phone,
      });

      if (response.success) {
        messageApi.success(
          t("profile.saveSuccess", "Профиль успешно обновлен"),
        );
      } else {
        messageApi.error(
          response.error || t("profile.saveError", "Ошибка при сохранении"),
        );
      }
    } catch (err) {
      console.error(err);
      messageApi.error(t("profile.saveError", "Ошибка при сохранении"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || pageLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {t("profile.title")}
        </Title>

        <div className={styles.balanceBox}>
          <div className={styles.balanceText}>
            <Text className={styles.balanceAmount}>
              {balance.toLocaleString("ru-RU")} ₸
            </Text>
            {user?.role === "DOCTOR" ? (
              <Button type="link" className={styles.bringOut}>
                {t("profile.bringOut")}
              </Button>
            ) : null}
          </div>
        </div>

        {payments.length > 0 && (
          <div className={styles.field}>
            <Text className={styles.label}>
              {t("profile.payments", "Мои платежи")}
            </Text>
            <List
              dataSource={payments.slice(0, 5)}
              renderItem={(p) => (
                <List.Item>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <Text strong>
                        {Number(p.amount).toLocaleString("ru-RU")} ₸
                      </Text>
                      <Tag
                        color={
                          p.status === "COMPLETED"
                            ? "green"
                            : p.status === "PENDING"
                              ? "gold"
                              : "red"
                        }
                      >
                        {p.status}
                      </Tag>
                    </div>
                    {p.description && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {p.description}
                      </Text>
                    )}
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {new Date(p.createdAt).toLocaleString("ru-RU")}
                    </Text>
                  </div>
                </List.Item>
              )}
              bordered
              size="small"
            />
          </div>
        )}

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.language")}</Text>
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
            style={{ width: "100%" }}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>
            {t("profile.lastName", "Фамилия")}
          </Text>
          <Input
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.firstName", "Имя")}</Text>
          <Input
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>
            {t("profile.patronymic", "Отчество")}
          </Text>
          <Input
            value={patronymic}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPatronymic(e.target.value)
            }
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.phone")}</Text>
          <Input
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            suffix={<Button type="link">{t("common.edit")}</Button>}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.card")}</Text>
          <Input
            value={card}
            disabled
            suffix={<Button type="link">{t("common.edit")}</Button>}
          />
        </div>
        {user?.role === "DOCTOR" && doctorProfile && (
          <DoctorProfileSection
            profile={doctorProfile}
            onSave={async (data) => {
              await apiClient.updateDoctor(doctorProfile.id, data);
              await loadDoctorProfile(user.id);
            }}
          />
        )}

        <ProfileUpload />
        <Button
          type="primary"
          block
          className={styles.saveBtn}
          onClick={handleSaveProfile}
          loading={isSaving}
        >
          {t("common.save")}
        </Button>
        <InfoLinks />

        <Divider style={{ margin: "24px 0" }} />
        <Button
          type="default"
          danger
          block
          icon={<LogoutOutlined />}
          className={styles.logoutButton}
          onClick={handleDelete}
          loading={logoutLoading}
        >
          {t("profile.deleteAccount")}
        </Button>
        <Button
          type="default"
          danger
          block
          icon={<LogoutOutlined />}
          className={styles.logoutButton}
          onClick={handleLogout}
          loading={logoutLoading}
        >
          {t("profile.logout")}
        </Button>
      </Card>
      <Modal
        title={t("profile.deleteAccountTitle")}
        open={showDeleteModal}
        onOk={confirmDelete}
        onCancel={cancelLogout}
        okText={t("common.delete")}
        cancelText={t("common.cancel")}
        okButtonProps={{ danger: true, loading: logoutLoading }}
        confirmLoading={logoutLoading}
        centered
      >
        <p>{t("profile.deleteAccountConfirm")}</p>
      </Modal>
      <Modal
        title={t("profile.logoutTitle")}
        open={showLogoutModal}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText={t("profile.logout")}
        cancelText={t("common.cancel")}
        okButtonProps={{ danger: true, loading: logoutLoading }}
        confirmLoading={logoutLoading}
        centered
      >
        <p>{t("profile.logoutConfirm")}</p>
      </Modal>
    </div>
  );
};

export default PersonalAccountPage;
