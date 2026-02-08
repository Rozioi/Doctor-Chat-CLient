import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import {
  Button,
  Card,
  Typography,
  message,
  Radio,
  Modal,
  Checkbox,
} from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import styles from "./styles/PaymentPage.module.scss";
import { useTranslation } from "react-i18next";
import { tg } from "../../shared/lib/telegram";

const { Title, Text } = Typography;

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { goBack } = useAppNavigation();
  const { user } = useAuth();
  const doctorIdParam = searchParams.get("doctorId");
  const serviceType = searchParams.get("serviceType") || "consultation";

  const [paymentMethod, setPaymentMethod] = useState<"robokassa">("robokassa");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);

  const [doctorData, setDoctorData] = useState<{
    name: string;
    price: number;
  } | null>(null);

  const { t } = useTranslation();

  const loadDoctorData = useCallback(async () => {
    if (!doctorIdParam) return;
    try {
      const response = await apiClient.getDoctorById(doctorIdParam);
      if (response.success && response.data) {
        const doctor = response.data;
        const name = doctor.user
          ? `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
            doctor.user.username ||
            "Врач"
          : "Врач";
        const price = Number(doctor.consultationFee || 0);
        setDoctorData({ name, price });
      }
    } catch (err) {
      console.error("Ошибка загрузки данных врача:", err);
    }
  }, [doctorIdParam]);

  useEffect(() => {
    if (doctorIdParam) loadDoctorData();
  }, [doctorIdParam, loadDoctorData]);

  const checkActiveChat = useCallback(
    async (doctorId: number): Promise<boolean> => {
      try {
        const telegramId =
          user?.id?.toString() || tg.initDataUnsafe?.user?.id?.toString();
        if (!telegramId) return false;

        const response = await apiClient.getChats(telegramId);
        if (response.success && response.data) {
          const activeChat = response.data.find(
            (chat) =>
              chat.status === "ACTIVE" &&
              chat.doctorId === doctorId &&
              chat.serviceType ===
                (serviceType === "analysis" ? "analysis" : "consultation"),
          );
          return !!activeChat;
        }
        return false;
      } catch (err) {
        console.error("Ошибка проверки активного чата:", err);
        return false;
      }
    },
    [user?.id, serviceType],
  );
  const URL = import.meta.env.VITE_REACT_APP_PDF_BASE_URL;

  const downloadOffer = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`${URL}/${fileName}`, "_blank");
  };

  const handlePayment = async () => {
    if (!doctorIdParam || !doctorData) {
      messageApi.error(
        t("payment.errors.incompleteData", "Данные для оплаты неполные"),
      );
      return;
    }
    const doctorIdNum = Number(doctorIdParam);
    const amount = doctorData.price;

    const hasActiveChat = await checkActiveChat(doctorIdNum);
    if (hasActiveChat) {
      messageApi.error(
        t(
          "payment.errors.activeChatExists",
          "У вас уже есть активный чат с этим врачом. Завершите текущую консультацию перед началом новой.",
        ),
      );
      return;
    }

    setLoading(true);

    try {
      const telegramId =
        user?.id?.toString() || tg.initDataUnsafe?.user?.id?.toString();

      if (!telegramId) {
        messageApi.error(
          t("payment.errors.unknownUser", "Не удалось определить пользователя"),
        );
        return;
      }

      const response = await apiClient.initRobokassaPayment({
        doctorId: doctorIdNum,
        amount,
        serviceType: serviceType === "analysis" ? "analysis" : "consultation",
        telegramId,
      });

      if (response.success && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        messageApi.error(
          response.error ||
            t("payment.errors.initError", "Ошибка при инициализации платежа"),
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      messageApi.error(
        t("payment.errors.processError", "Ошибка при обработке платежа"),
      );
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = () =>
    serviceType === "analysis"
      ? t("chats.analysis", "Расшифровка анализов")
      : t("chats.consultation", "Консультация");

  return (
    <div className={styles.container}>
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>
      {contextHolder}
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {t("payment.title")}
        </Title>

        {doctorData && (
          <div className={styles.serviceInfo}>
            <Text className={styles.serviceName}>{getServiceName()}</Text>
            <Text className={styles.doctorName}>
              {t("chats.doctor", "Врач")}: {doctorData.name}
            </Text>
            <Text className={styles.price}>
              {doctorData.price.toLocaleString("ru-RU")} ₸
            </Text>
            {/*<Button
              type="link"
              onClick={() => (window.location.href = "/service")}
              style={{ padding: 0, height: "auto", marginTop: 8 }}
            >
              {t("payment.aboutServices")}
            </Button>*/}
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <Text className={styles.label}>{t("payment.methodLabel")}</Text>
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={styles.paymentMethodGroup}
            >
              <Radio value="robokassa" className={styles.paymentRadio}>
                <CreditCardOutlined /> Robokassa (Карты Казахстана и СНГ)
              </Radio>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            size="large"
            block
            className={styles.payButton}
            onClick={() => setIsOfferModalOpen(true)}
            loading={loading}
            disabled={!doctorData}
          >
            {t("payment.payButton", {
              amount: doctorData?.price.toLocaleString("ru-RU") ?? "",
            })}
          </Button>
        </div>
      </Card>

      <Modal
        title={t("payment.offerTitle", "Принятие оферты")}
        open={isOfferModalOpen}
        onOk={() => {
          if (!isOfferAccepted) return;
          setIsOfferModalOpen(false);
          handlePayment();
        }}
        onCancel={() => setIsOfferModalOpen(false)}
        okButtonProps={{ disabled: !isOfferAccepted, loading }}
        cancelButtonProps={{ disabled: loading }}
        centered
        okText={t("payment.offerOk", "Продолжить")}
        cancelText={t("payment.offerCancel", "Отмена")}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "10px 0",
          }}
        >
          <Checkbox
            checked={isOfferAccepted}
            onChange={(e) => setIsOfferAccepted(e.target.checked)}
          >
            <Text>
              {t("payment.offerTextPrefix", "Я принимаю условия")}{" "}
              <a
                style={{ color: "#3b82f6" }}
                download
                onClick={(e) => {
                  downloadOffer(e, "terms1.pdf");
                }}
              >
                {t("payment.offerLink", "Договора публичной оферты")}
              </a>{" "}
              {t("payment.andPay", "и")}{" "}
              <a
                rel="noopener noreferrer"
                style={{ color: "#3b82f6" }}
                download
                onClick={(e) => {
                  downloadOffer(e, "privacy1.pdf");
                }}
              >
                {t("payment.privacyLink", "Политики конфиденциальности")}
              </a>
            </Text>
          </Checkbox>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              {t("payment.robo", "Платежи защищены системой Robokassa")}
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
