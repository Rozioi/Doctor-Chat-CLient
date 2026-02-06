import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Modal,
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
const { Title, Text } = Typography;

const PersonalAccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [balance] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [card] = useState("Visa **** 9399");
  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const [doctorProfile, setDoctorProfile] = useState<{
    id: number;
    consultationFee: number | string;
    description: string;
    specialization: string;
  } | null>(null);
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
    if (user) {
      const fullName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName ||
          user.lastName ||
          user.username ||
          t("profile.user");
      setName(fullName);
      setPhone(user.phoneNumber || "");

      if (user.role === "DOCTOR" && user.id) {
        loadDoctorProfile(user.id);
      }
    } else {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
        const fullName =
          telegramUser.first_name && telegramUser.last_name
            ? `${telegramUser.first_name} ${telegramUser.last_name}`
            : telegramUser.first_name ||
            telegramUser.username ||
            t("profile.user");
        setName(fullName);
      }
    }
  }, [user, t]);

  const loadDoctorProfile = async (userId: string | number) => {
    try {
      const response = await apiClient.getDoctorByUserId(userId);
      if (response.success && response.data) {
        console.log(response.data);
        setDoctorProfile(response.data);
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
              {balance.toLocaleString()} ₸
            </Text>
            {user?.role === "DOCTOR" ? (
              <Button type="link" className={styles.bringOut}>
                {t("profile.bringOut")}
              </Button>
            ) : null}
          </div>
        </div>

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
          <Text className={styles.label}>{t("profile.name")}</Text>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            suffix={<Button type="link">{t("common.edit")}</Button>}
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
        <Button type="primary" block className={styles.saveBtn}>
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
