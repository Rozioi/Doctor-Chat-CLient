import React, { useState } from "react";
import { Card, Typography, Button, Input, message, Select } from "antd";
import { MedicineBoxOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

export interface DoctorProfile {
  id: number;
  consultationFee: number | string;
  description: string;
  specialization: string;
  languages?: string[];
}

interface Props {
  profile: DoctorProfile;
  onSave: (data: {
    consultationFee: number;
    description: string;
    languages: string[];
  }) => Promise<void>;
}

const DoctorProfileSection: React.FC<Props> = ({ profile, onSave }) => {
  const [editMode, setEditMode] = useState<null | "price" | "about">(null);
  const [fee, setFee] = useState(Number(profile.consultationFee) || 0);
  const { t } = useTranslation();
  const [description, setDescription] = useState(profile.description || "");
  const [languages, setLanguages] = useState<string[]>(profile.languages || []);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const LANGUAGES = [
    { value: "Russian", label: "Русский" },
    { value: "English", label: "English" },
    { value: "Kazakh", label: "Қазақша" },
    { value: "Uzbek", label: "O'zbekcha" },
    { value: "Turkish", label: "Türkçe" },
    { value: "German", label: "Deutsch" },
    { value: "French", label: "Français" },
    { value: "Spanish", label: "Español" },
  ];

  const handleSave = async () => {
    if (description.trim().length < 10) {
      messageApi.error(t("doctorProfile.descriptionError"));
      return;
    }

    try {
      setSaving(true);
      await onSave({ consultationFee: fee, description, languages });
      setEditMode(null);
      messageApi.success(t("doctorProfile.updated"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      style={{
        marginTop: 32,
        borderRadius: 20,
        border: "1px solid #e6edff",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {contextHolder}
      <div
        style={{
          padding: 20,
          background: "linear-gradient(90deg, #6c8bff, #709bff)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <MedicineBoxOutlined />
          {t("doctorProfile.badge")}
        </div>

        <Title level={4} style={{ color: "#fff", marginTop: 8 }}>
          {t(`doctorRegistration.specializations.${profile.specialization}`) ||
            profile.specialization}
        </Title>
      </div>

      <div style={{ padding: 20 }}>
        <div
          style={{
            background: "#f5f7ff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <Text type="secondary">{t("doctorProfile.price")}</Text>

          {editMode === "price" ? (
            <Input
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value) || 0)}
              addonAfter="₸"
              style={{ marginTop: 8 }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Title level={3} style={{ margin: 0 }}>
                {fee.toLocaleString()} ₸
              </Title>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setEditMode("price")}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text strong>{t("doctorProfile.about")}</Text>
            {editMode !== "about" && (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setEditMode("about")}
              />
            )}
          </div>

          {editMode === "about" ? (
            <Input.TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoSize={{ minRows: 4, maxRows: 10 }}
              style={{ resize: "none" }}
            />
          ) : (
            <Text style={{ lineHeight: 1.6, color: "#4a4a4a" }}>
              {description || t("doctorProfile.emptyDescription")}
            </Text>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text strong>{t("doctorRegistration.languages")}</Text>
            {editMode !== "about" && ( // Reusing "about" edit mode or should I add a new one?
              // I'll just make languages editable when in "about" or add it as a separate section.
              // For simplicity, I'll allow editing languages when "about" is in edit mode.
              null
            )}
          </div>

          {editMode === "about" ? (
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder={t("doctorRegistration.languagesPlaceholder")}
              value={languages}
              onChange={setLanguages}
              options={LANGUAGES}
            />
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {languages.length > 0 ? (
                languages.map((lang) => (
                  <div
                    key={lang}
                    style={{
                      background: "#e4eaff",
                      color: "#4d7bfb",
                      padding: "2px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {LANGUAGES.find((l) => l.value === lang)?.label || lang}
                  </div>
                ))
              ) : (
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Языки не указаны
                </Text>
              )}
            </div>
          )}
        </div>

        {editMode && (
          <div style={{ display: "flex", gap: 12 }}>
            <Button type="primary" onClick={handleSave} loading={saving} block>
              {t("doctorProfile.save")}
            </Button>
            <Button
              block
              onClick={() => {
                setEditMode(null);
                setFee(Number(profile.consultationFee) || 0);
                setDescription(profile.description || "");
                setLanguages(profile.languages || []);
              }}
            >
              {t("doctorProfile.cancel")}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DoctorProfileSection;
