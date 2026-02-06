import React, { useState } from "react";
import { Card, Typography, Button, Input, message } from "antd";
import { MedicineBoxOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

export interface DoctorProfile {
  id: number;
  consultationFee: number | string;
  description: string;
  specialization: string;
}

interface Props {
  profile: DoctorProfile;
  onSave: (data: {
    consultationFee: number;
    description: string;
  }) => Promise<void>;
}

const DoctorProfileSection: React.FC<Props> = ({ profile, onSave }) => {
  const [editMode, setEditMode] = useState<null | "price" | "about">(null);
  const [fee, setFee] = useState(Number(profile.consultationFee) || 0);
  const { t } = useTranslation();
  const [description, setDescription] = useState(profile.description || "");
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSave = async () => {
    if (description.trim().length < 10) {
      messageApi.error(t("doctorProfile.descriptionError"));
      return;
    }

    try {
      setSaving(true);
      await onSave({ consultationFee: fee, description });
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
