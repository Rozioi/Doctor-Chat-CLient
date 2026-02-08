import logo from "../../../shared/assets/images/logo.png";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { CustomSelect } from "../../../shared/ui/CustomSelect/CustomSelect";
import { useEffect } from "react";
import styles from "../styles/Onboarding.module.scss";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";

export const OnBoardingPage = () => {
  const { goTo } = useAppNavigation();
  const { isLogin } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (code: string) => {
    try {
      localStorage.setItem("lang", code);
      i18n.changeLanguage(code);
    } catch (e) {
      console.error("Failed to save language:", e);
    }
  };

  useEffect(() => {
    localStorage.setItem("onboardingSeen", "true");
  }, []);

  if (isLogin) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={styles["page"]}>
      <div className={styles["logo-container"]}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <div className={styles["blur-bg"]}></div>
      </div>
      <div className={styles["text-container"]}>
        <h1 style={{ color: "white", fontSize: "1.9rem" }}>MED EXPERT EU</h1>
        <h1 className={styles.text}>{t("onboarding.title")}</h1>
        <p
          className={styles["description"]}
          dangerouslySetInnerHTML={{
            __html: t("onboarding.description", {
              interpolation: { escapeValue: false },
            })
              .replace(
                /<bold>/g,
                '<strong style="font-weight: bold; color: #50d6ba;">',
              )
              .replace(/<\/bold>/g, "</strong>"),
          }}
        />
      </div>
      <div className={styles.wrapper}>
        <CustomSelect
          value={i18n.language.startsWith("ru") ? "ru" : "en"}
          options={[
            { value: "ru", label: "Русский" },
            { value: "en", label: "English" },
          ]}
          onChange={handleLanguageChange}
        />
      </div>
      <div className={styles.buttons}>
        <button
          onClick={() => {
            goTo("/login");
          }}
          className={styles.login}
        >
          {t("onboarding.login")}
        </button>
        <div className={styles.registerGroup}>
          <button onClick={() => goTo("/register")} className={styles.register}>
            {t("onboarding.register")}
          </button>
          <a
            href="#"
            onClick={() => goTo("/doctor-registration")}
            className={styles.link}
          >
            {t("onboarding.iAmDoctor")}
          </a>
        </div>
      </div>
    </div>
  );
};
