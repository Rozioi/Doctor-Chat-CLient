import { useState } from "react";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import { Checkbox, message } from "antd";
import styles from "../styles/AutheticatedPage.module.scss";
import { useRegistration } from "../../../features/auth/hooks/useRegistration";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { IoIosArrowBack } from "react-icons/io";
import "react-phone-input-2/lib/style.css";
import "antd/dist/reset.css";
import { useTranslation } from "react-i18next";
import { mapServerError } from "../../../shared/utils/errorMapper";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { goTo, goBack } = useAppNavigation();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    phoneNumber,
    setPhoneNumber,
    isSubmitting,
    error,
    user,
    handleSubmit,
  } = useRegistration();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!acceptedTerms) {
      messageApi.error(
        t("auth.acceptTermsError", "Необходимо принять условия использования"),
      );
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      messageApi.error(
        t(
          "auth.phoneValidationError",
          "Пожалуйста, введите корректный номер телефона",
        ),
      );
      return;
    }

    const success = await handleSubmit();
    if (success) {
      messageApi.success(
        t("auth.registerSuccess", "Регистрация прошла успешно"),
      );
      navigate("/");
    } else {
      messageApi.error(mapServerError(error || ""));
    }
  };

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      {contextHolder}
      <div className={styles.page}>
        <div onClick={goBack} className={styles.backButton}>
          <IoIosArrowBack />
        </div>
        <div className={styles.loginCard}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>{t("auth.registerTitle")}</h1>
            <p className={styles.subtitle}>{t("auth.registerSubtitle")}</p>

            <div className={styles.inputWrapper}>
              <label>
                {t("auth.phoneLabel")}
                <PhoneInput
                  country={"kz"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  inputClass={styles.phoneInput}
                  containerClass={styles.phoneContainer}
                  buttonClass={styles.flagDropdown}
                  dropdownClass={styles.countryList}
                  preferredCountries={["kz", "by", "ru", "ua"]}
                  placeholder="+7 (000) 000-00-00"
                  inputProps={{
                    name: "phone",
                    required: true,
                    disabled: isSubmitting,
                  }}
                  enableSearch={true}
                  specialLabel={""}
                />
              </label>
            </div>

            <div className={styles.privacyWrapper}>
              <Checkbox
                className={styles.checkbox}
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={isSubmitting}
              />
              <p className={styles.privacyText}>
                {t("auth.acceptPreffix", "Я принимаю")}{" "}
                <a
                  href={`${import.meta.env.VITE_REACT_APP_PDF_BASE_URL}privacy-policy-and-consent-to-data-processing.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {t("auth.privacyLink", "политику конфиденциальности")}
                </a>{" "}
                {t("auth.and", "и")}{" "}
                <a
                  href={`${import.meta.env.VITE_REACT_APP_PDF_BASE_URL}user-agreement-public-offer-med-expert-eu.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {t("auth.rulesLink", "правила пользования")}
                </a>{" "}
                {t("auth.appSuffix", "приложением")}
              </p>
            </div>

            <button
              className={styles.loginButton}
              onClick={handleRegister}
              disabled={isSubmitting || !acceptedTerms}
            >
              {isSubmitting
                ? t("auth.registerLoading")
                : t("auth.registerButton")}
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goTo("/login");
              }}
              className={styles.link}
            >
              {t("auth.loginButton")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
