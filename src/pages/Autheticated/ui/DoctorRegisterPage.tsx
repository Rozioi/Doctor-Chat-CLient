import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Input, Select, Button, Checkbox, message } from "antd";
import PhoneInput from "react-phone-input-2";
import SelectCountry from "react-select";
import countryList from "react-select-country-list";
import { useTranslation } from "react-i18next";
import "react-phone-input-2/lib/style.css";
import "antd/dist/reset.css";
import styles from "../styles/DoctorRegisterPage.module.scss";
import type { DoctorInput } from "../../../api/types";
import { useAuthReq } from "../../../hooks/useAuthReq";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { IoIosArrowBack } from "react-icons/io";
import { mapServerError } from "../../../shared/utils/errorMapper";

const { TextArea } = Input;

const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const { goBack } = useAppNavigation();
  const { t } = useTranslation();
  const options = countryList().getData();
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const SPECIALIZATIONS = {
    therapist: t("doctorRegistration.therapist"),
    pediatrician: t("doctorRegistration.pediatrician"),
    surgeon: t("doctorRegistration.surgeon"),
    dentist: t("doctorRegistration.dentist"),
    cardiologist: t("doctorRegistration.cardiologist"),
    gynecologist: t("doctorRegistration.gynecologist"),
    ent: t("doctorRegistration.ent"),
    neurologist: t("doctorRegistration.neurologist"),
    ophthalmologist: t("doctorRegistration.ophthalmologist"),
    psychiatrist: t("doctorRegistration.psychiatrist"),
    dermatologist: t("doctorRegistration.dermatologist"),
  };
  const [doctorData, setDoctorData] = useState<DoctorInput>({
    specialization: "",
    qualification: "",
    experience: 0,
    description: "",
    education: "",
    certificates: [],
    consultationFee: 0,
    country: "",
  });

  const { createDoctor } = useAuthReq();

  useEffect(() => { }, []);

  const handleChange = (field: keyof DoctorInput, value: string | number | string[]) => {
    setDoctorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      messageApi.warning(t("doctorRegistration.errors.acceptTerms"));
      return;
    }

    if (!phoneNumber) {
      messageApi.error(t("doctorRegistration.errors.phoneRequired"));
      return;
    }

    if (!doctorData.qualification) {
      messageApi.error(t("doctorRegistration.errors.qualificationRequired"));
      return;
    }

    if (!doctorData.country) {
      messageApi.error(t("doctorRegistration.errors.countryRequired"));
      return;
    }

    if (!doctorData.description || doctorData.description.trim().length < 10) {
      messageApi.error(t("doctorRegistration.errors.descriptionRequired"));
      return;
    }

    if (doctorData.experience < 0 || doctorData.experience > 50) {
      messageApi.error(t("doctorRegistration.errors.experienceRange"));
      return;
    }

    if (doctorData.consultationFee < 0) {
      messageApi.error(t("doctorRegistration.errors.consultationFeeNegative"));
      return;
    }

    setIsSubmitting(true);

    try {
      const doctorResponse = await createDoctor(
        {
          ...doctorData,
          specialization: doctorData.specialization || doctorData.qualification,
        },
        phoneNumber,
      );

      if (!doctorResponse.success) {
        messageApi.error(mapServerError(doctorResponse.error || ""));
        setIsSubmitting(false);
        return;
      }

      messageApi.success({
        content: t("doctorRegistration.errors.success"),
        duration: 5,
      });

      setTimeout(() => {
        navigate("/login");
        setIsSubmitting(false);
      }, 2000);
    } catch (err: any) {
      messageApi.error(mapServerError(err?.message || ""));
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer} ref={pageContainerRef}>
      {contextHolder}
      <div className={styles.page}>
        <div onClick={goBack} className={styles.backButton}>
          <IoIosArrowBack />
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>{t("doctorRegistration.title")}</h1>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.phone")}
            </label>
            <PhoneInput
              country={"kz"}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputClass={styles.phoneInput}
              containerClass={styles.phoneContainer}
              placeholder="+7 (000) 000-00-00"
              inputProps={{ required: true, disabled: isSubmitting }}
              enableSearch={true}
              specialLabel={""}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.experience")}
            </label>
            <Input
              type="number"
              placeholder={t("doctorRegistration.experiencePlaceholder")}
              className={styles.input}
              min={0}
              max={50}
              value={doctorData.experience || ""}
              onChange={(e) =>
                handleChange("experience", parseInt(e.target.value) || 0)
              }
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.specialization")}
            </label>
            <Select
              placeholder={t("doctorRegistration.specializationPlaceholder")}
              className={styles.select}
              onChange={(val) => {
                handleChange("specialization", val);
                handleChange("qualification", val);
              }}
              value={doctorData.specialization || undefined}
              options={Object.entries(SPECIALIZATIONS).map(([key]) => ({
                value: key,
                label: t(`doctorRegistration.specializations.${key}`),
              }))}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.qualification")}
            </label>
            <Select
              placeholder={t("doctorRegistration.qualificationPlaceholder")}
              className={styles.select}
              onChange={(val) => handleChange("qualification", val)}
              value={doctorData.qualification || undefined}
              options={[
                {
                  value: "Врач первой категории",
                  label: t("doctorRegistration.qualifications.first"),
                },
                {
                  value: "Врач второй категории",
                  label: t("doctorRegistration.qualifications.second"),
                },
                {
                  value: "Врач высшей категории",
                  label: t("doctorRegistration.qualifications.highest"),
                },
                {
                  value: "Кандидат медицинских наук",
                  label: t("doctorRegistration.qualifications.candidate"),
                },
                {
                  value: "Доктор медицинских наук",
                  label: t("doctorRegistration.qualifications.doctor"),
                },
              ]}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.education")}
            </label>
            <Input
              placeholder={t("doctorRegistration.educationPlaceholder")}
              className={styles.input}
              value={doctorData.education}
              onChange={(e) => handleChange("education", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.description")}
            </label>
            <TextArea
              placeholder={t("doctorRegistration.descriptionPlaceholder")}
              rows={4}
              className={styles.textarea}
              value={doctorData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.consultationFee")}
            </label>
            <Input
              type="number"
              placeholder={t("doctorRegistration.consultationFeePlaceholder")}
              className={styles.input}
              min={0}
              value={doctorData.consultationFee || ""}
              onChange={(e) =>
                handleChange("consultationFee", parseFloat(e.target.value) || 0)
              }
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {t("doctorRegistration.country")}
            </label>
            <SelectCountry
              options={options}
              placeholder={t("doctorRegistration.countryPlaceholder")}
              classNamePrefix="country-select"
              formatOptionLabel={(option) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={`https://flagcdn.com/24x18/${option.value.toLowerCase()}.png`}
                    alt={option.label}
                    style={{ width: 24, height: 18, borderRadius: 2 }}
                  />
                  <span>{option.label}</span>
                </div>
              )}
              styles={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: "#f6f8ff",
                  borderRadius: 12,
                  border: state.isFocused
                    ? "1px solid #8eb4ff"
                    : "1px solid #e0e6f6",
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(141, 181, 255, 0.3)"
                    : "none",
                  minHeight: 44,
                  padding: "2px 4px",
                  "&:hover": { borderColor: "#8eb4ff" },
                }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                placeholder: (base: any) => ({
                  ...base,
                  color: "#b3b8c6",
                  fontSize: 14,
                }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                menu: (base: any) => ({
                  ...base,
                  zIndex: 9999,
                  borderRadius: 12,
                }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                singleValue: (base: any) => ({
                  ...base,
                  color: "#2f2f2f",
                  fontSize: 14,
                }),
              }}
              value={
                options.find((opt: { value: string }) => opt.value === doctorData.country) || null
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(opt: any) => handleChange("country", opt?.value || "")}
              isDisabled={isSubmitting}
            />
          </div>

          <div className={styles.privacyWrapper}>
            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              disabled={isSubmitting}
            />
            <p className={styles.privacyText}>
              {t("doctorRegistration.acceptTerms")}{" "}
              <a href="#" className={styles.link}>
                {t("doctorRegistration.privacyPolicy")}
              </a>{" "}
              {t("doctorRegistration.and")}{" "}
              <a href="#" className={styles.link}>
                {t("doctorRegistration.termsOfUse")}
              </a>{" "}
              {t("doctorRegistration.app")}
            </p>
          </div>

          <Button
            type="primary"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting || !acceptedTerms}
            loading={isSubmitting}
            block
          >
            {isSubmitting
              ? t("doctorRegistration.submitting")
              : t("doctorRegistration.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
