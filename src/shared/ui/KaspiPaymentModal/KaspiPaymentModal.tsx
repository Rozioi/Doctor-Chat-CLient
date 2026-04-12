import type { FC } from "react";
import { useState, useEffect } from "react";
import { Modal, Button, message, Spin } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./KaspiPaymentModal.module.css";
import {
  CheckOutlined,
  CloseOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

interface KaspiPaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  amount: number;
  doctorId: number | string;
  serviceType: string;
  tariffType: string;
  telegramId: string;
  onSuccess: (chatId: number) => void;
}

export const KaspiPaymentModal: FC<KaspiPaymentModalProps> = ({
  isVisible,
  onClose,
  amount,
  doctorId,
  serviceType,
  tariffType,
  telegramId,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [status, setStatus] = useState<
    "IDLE" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED"
  >("IDLE");

  const API_URL =
    import.meta.env.SERVER_API_BASE_URL ||
    "https://doctor-chat-backend-production.up.railway.app";

  useEffect(() => {
    let interval: any;

    if (status === "PENDING" && paymentId) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${API_URL}/api/v1/payment/${paymentId}/status`,
          );
          if (response.data.status === "COMPLETED") {
            setStatus("COMPLETED");
            clearInterval(interval);
            message.success(t("paymentSelection.kzKaspiSuccess"));
            setTimeout(() => {
              onSuccess(response.data.chatId);
            }, 2000);
          } else if (response.data.status === "FAILED") {
            setStatus("FAILED");
            clearInterval(interval);
            message.error(t("paymentSelection.kzKaspiError"));
          } else if (response.data.status === "CANCELLED") {
            setStatus("CANCELLED");
            clearInterval(interval);
            message.warning("Платеж был отменен или истек");
          } else if (response.data.status === "REFUNDED") {
            setStatus("REFUNDED");
            clearInterval(interval);
            message.info("Платеж был возвращен");
          }
        } catch (error) {
          console.error("Error polling payment status:", error);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, paymentId, API_URL, onSuccess, t]);

  const handleCreateInvoice = async () => {
    const sanitized = phoneNumber.replace(/\D/g, "");

    let finalPhone = sanitized;

    if (!finalPhone.startsWith("8")) {
      finalPhone = "+" + finalPhone;
    }

    if (!sanitized || sanitized.length < 10) {
      message.warning(t("auth.errors.invalidData"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/payment/kaspi/create`,
        {
          amount,
          doctorId: Number(doctorId),
          serviceType,
          tariffType,
          telegramId,
          phoneNumber: finalPhone,
        },
      );

      if (response.data.success) {
        setPaymentId(response.data.paymentId);
        setStatus("PENDING");
        message.info(t("paymentSelection.kzKaspiInvoiceSent"));
      } else {
        message.error(t("paymentSelection.kzKaspiError"));
      }
    } catch (error) {
      console.error("Error creating Kaspi invoice:", error);
      message.error(
        t("paymentSelection.kzKaspiError", "Проверьте введенный номер!"),
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title={t("paymentSelection.kzKaspiTitle")}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      className="kaspi-premium-modal"
      width={420}
    >
      <div className={styles.modalContent}>
        {status === "IDLE" && (
          <>
            <p className={styles.description}>
              {t("paymentSelection.kzKaspiPhoneLabel")}
            </p>
            <div className={styles.phoneInputContainer}>
              <PhoneInput
                country={"kz"}
                value={phoneNumber}
                onChange={(value) => {
                  // If user starts typing 8 after the prefix 7, we strip the 8
                  // value from react-phone-input-2 is just digits (e.g., '7807...')
                  if (value.startsWith("78") && value.length > 2) {
                    setPhoneNumber("8" + value.slice(2));
                  } else {
                    setPhoneNumber(value);
                  }
                }}
                placeholder={t("paymentSelection.kzKaspiPhonePlaceholder")}
                onlyCountries={["kz", "ru"]}
                disableDropdown
                countryCodeEditable={true}
              />
            </div>
            <Button
              type="primary"
              className={styles.payButton}
              onClick={handleCreateInvoice}
              loading={isLoading}
              icon={!isLoading && <CreditCardOutlined />}
            >
              {t("paymentSelection.kzKaspiGetInvoice", {
                amount: amount.toLocaleString(),
              })}
            </Button>
          </>
        )}

        {status === "PENDING" && (
          <div className={styles.statusContainer}>
            <div className={styles.spinnerWrapper}>
              <Spin size="large" />
            </div>
            <h3 className={styles.statusTitle}>
              {t("paymentSelection.kzKaspiInvoiceSent")}
            </h3>
            <p className={styles.statusSubtitle}>
              {t("paymentSelection.kzKaspiWaitPayment")}
            </p>
          </div>
        )}

        {status === "COMPLETED" && (
          <div className={styles.statusContainer}>
            <div className={`${styles.iconWrapper} ${styles.successIcon}`}>
              <CheckOutlined />
            </div>
            <h3 className={styles.statusTitle}>
              {t("paymentSelection.kzKaspiSuccess")}
            </h3>
            <p className={styles.statusSubtitle}>
              Ваша консультация активирована. Врач скоро свяжется с вами!
            </p>
          </div>
        )}

        {status === "FAILED" && (
          <div className={styles.statusContainer}>
            <div className={`${styles.iconWrapper} ${styles.errorIcon}`}>
              <CloseOutlined />
            </div>
            <h3 className={styles.statusTitle}>
              {t("paymentSelection.kzKaspiError")}
            </h3>
            <p className={styles.statusSubtitle}>
              К сожалению, при создании счета возникла ошибка. Попробуйте еще
              раз.
            </p>
            <Button
              className={styles.backButton}
              onClick={() => setStatus("IDLE")}
              size="large"
            >
              {t("common.back")}
            </Button>
          </div>
        )}

        {status === "CANCELLED" && (
          <div className={styles.statusContainer}>
            <div className={`${styles.iconWrapper} ${styles.errorIcon}`}>
              <CloseOutlined />
            </div>
            <h3 className={styles.statusTitle}>Оплата отменена</h3>
            <p className={styles.statusSubtitle}>
              Счет был отменен или время на оплату истекло. Пожалуйста,
              попробуйте создать новый счет.
            </p>
            <Button
              className={styles.backButton}
              onClick={() => setStatus("IDLE")}
              size="large"
            >
              {t("common.back")}
            </Button>
          </div>
        )}

        {status === "REFUNDED" && (
          <div className={styles.statusContainer}>
            <div
              className={`${styles.iconWrapper} ${styles.successIcon}`}
              style={{ backgroundColor: "#f0f0f0", color: "#8c8c8c" }}
            >
              <CheckOutlined />
            </div>
            <h3 className={styles.statusTitle}>Средства возвращены</h3>
            <p className={styles.statusSubtitle}>
              Ваш платеж был возвращен. Если у вас возникли вопросы, обратитесь
              в поддержку.
            </p>
            <Button
              className={styles.backButton}
              onClick={onClose}
              size="large"
            >
              Закрыть
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
