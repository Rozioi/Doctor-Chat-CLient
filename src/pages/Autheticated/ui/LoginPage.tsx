import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "../styles/AutheticatedPage.module.scss";
import "antd/dist/reset.css";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { IoIosArrowBack } from "react-icons/io";
import { message } from "antd";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const { loginFunc } = useAuth();
  const { goBack } = useAppNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    const savedPhone = localStorage.getItem("phoneNumber");
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const handleLogin = async () => {
    if (!phone || phone.length < 10) {
      messageApi.error(
        t(
          "auth.phoneValidationError",
          "Пожалуйста, введите корректный номер телефона",
        ),
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginFunc(phone);
      if (response.success) {
        messageApi.success(t("auth.loginSuccess", "Вход выполнен успешно"));
        navigate("/home");
      } else {
        messageApi.error(t("auth.loginError", "Ошибка входа"));
      }
    } catch (err) {
      messageApi.error(
        t(
          "auth.loginUnknownError",
          "Произошла ошибка при входе. Попробуйте еще раз.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {contextHolder}
      <div className={styles.page}>
        <div onClick={goBack} className={styles.backButton}>
          <IoIosArrowBack />
        </div>
        <div className={styles.loginCard}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>{t("auth.loginTitle")}</h1>
            <p className={styles.subtitle}>{t("auth.loginSubtitle")}</p>

            <div className={styles.inputWrapper}>
              <label>
                {t("auth.phoneLabel")}
                <PhoneInput
                  country={"kz"}
                  value={phone}
                  onChange={setPhone}
                  inputClass={styles.phoneInput}
                  containerClass={styles.phoneContainer}
                  buttonClass={styles.flagDropdown}
                  dropdownClass={styles.countryList}
                  preferredCountries={["kz", "by", "ru", "ua"]}
                  placeholder="+7 (000) 000-00-00"
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                  enableSearch={true}
                  specialLabel={""}
                />
              </label>
            </div>

            <button
              className={styles.loginButton}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? t("auth.loginLoading") : t("auth.loginButton")}
            </button>

            <div className={styles.privacyWrapper}>
              <span className={styles.privacyText}>
                {t("auth.privacyNotice")}
              </span>
            </div>

            <div className={styles.legalLinks}>
              <a
                href="/terms"
                rel="noopener noreferrer"
                className={styles.legalLink}
              >
                {t("auth.userAgreementLink")}
              </a>

              <span className={styles.dot}>•</span>

              <a
                href="/privacy"
                rel="noopener noreferrer"
                className={styles.legalLink}
              >
                {t("auth.privacyLink")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
