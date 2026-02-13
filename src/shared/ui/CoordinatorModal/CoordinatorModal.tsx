import { Modal, Button } from "antd";
import { useTranslation } from "react-i18next";
import { MessageOutlined } from "@ant-design/icons";
import styles from "./CoordinatorModal.module.scss";

type CoordinatorModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CoordinatorModal = ({ open, onClose }: CoordinatorModalProps) => {
  const { t } = useTranslation();

  const handleContactTelegram = () => {
    window.open("https://t.me/m/ZEH5m-TsMTMy", "_blank");
  };

  return (
    <Modal
      title={t("coordinatorModal.title")}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className={styles.content}>
        <MessageOutlined className={styles.icon} />

        <p className={styles.text}>{t("coordinatorModal.subtitle")}</p>

        <ul className={styles.list}>
          <li>{t("coordinatorModal.point1")}</li>
          <li>{t("coordinatorModal.point2")}</li>
          <li>{t("coordinatorModal.point3")}</li>
        </ul>

        <Button
          type="primary"
          icon={<MessageOutlined />}
          className={styles.contactButton}
          onClick={handleContactTelegram}
        >
          {t("coordinatorModal.button")}
        </Button>
      </div>
    </Modal>
  );
};
