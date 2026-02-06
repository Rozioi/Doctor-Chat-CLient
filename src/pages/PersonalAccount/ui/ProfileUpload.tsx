import React, { useState, useEffect } from "react";
import { Upload, Avatar, message, Spin } from "antd";
import { MdAddAPhoto } from "react-icons/md";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { apiClient } from "../../../api/api";
import { useTranslation } from "react-i18next";
import { tg } from "../../../shared/lib/telegram";
import styles from "../styles/ProfileUpload.module.scss";

const ProfileUpload: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.photoUrl) {
      setPhotoUrl(user.photoUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((tg.initDataUnsafe.user as any)?.photo_url) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPhotoUrl((tg.initDataUnsafe.user as any).photo_url);
    }
  }, [user]);

  const handlePhotoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      message.error(t("profileUpload.errors.fileSize"));
      return false;
    }

    if (!file.type.startsWith("image/")) {
      message.error(t("profileUpload.errors.fileType"));
      return false;
    }

    if (!user?.id) {
      message.error(t("profileUpload.errors.unknownUser"));
      return false;
    }

    setUploading(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPhotoUrl(previewUrl);

      const uploadResponse = await apiClient.uploadAvatar(file);

      if (!uploadResponse.success || !uploadResponse.data) {
        message.error(uploadResponse.error || t("profileUpload.errors.uploadError"));
        if (user?.photoUrl) {
          setPhotoUrl(user.photoUrl);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((tg.initDataUnsafe.user as any)?.photo_url) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPhotoUrl((tg.initDataUnsafe.user as any).photo_url);
        } else {
          setPhotoUrl(null);
        }
        setUploading(false);
        return false;
      }

      const updateResponse = await apiClient.updateUserPhotoUrl(
        String(user.id),
        uploadResponse.data.url,
      );

      if (updateResponse.success && updateResponse.data) {
        setPhotoUrl(uploadResponse.data.url);

        localStorage.setItem("user", JSON.stringify(updateResponse.data));

        message.success(t("profileUpload.success"));

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        message.error(updateResponse.error || t("profileUpload.errors.updateError"));
        if (user?.photoUrl) {
          setPhotoUrl(user.photoUrl);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((tg.initDataUnsafe.user as any)?.photo_url) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPhotoUrl((tg.initDataUnsafe.user as any).photo_url);
        } else {
          setPhotoUrl(null);
        }
      }
    } catch {
      message.error(t("profileUpload.errors.generalError"));
      if (user?.photoUrl) {
        setPhotoUrl(user.photoUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((tg.initDataUnsafe.user as any)?.photo_url) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPhotoUrl((tg.initDataUnsafe.user as any).photo_url);
      } else {
        setPhotoUrl(null);
      }
    } finally {
      setUploading(false);
    }

    return false;
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{t("profile.photo")}</p>
      <Upload
        name="avatar"
        listType="text"
        showUploadList={false}
        beforeUpload={handlePhotoUpload}
        accept="image/*"
        className={styles.uploadBox}
        disabled={uploading}
      >
        <div className={styles.avatarWrapper}>
          {uploading ? (
            <Spin size="large" />
          ) : photoUrl ? (
            <Avatar src={photoUrl} size={120} className={styles.avatar} />
          ) : (
            <div className={styles.iconWrapper}>
              <MdAddAPhoto className={styles.icon} />
            </div>
          )}
        </div>
      </Upload>
    </div>
  );
};

export default ProfileUpload;
