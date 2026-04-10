import { Modal, Button } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./AdaptationModal.module.scss";

type AdaptationModalProps = {
  open: boolean;
  onClose: () => void;
};

export const AdaptationModal = ({ open, onClose }: AdaptationModalProps) => {
  const { t } = useTranslation();

  const handleOpenPartner = () => {
    window.open("https://t.me/m/rewJBA2PMDgy", "_blank");
  };

  return (
    <Modal
      title={t("adaptModal.title", "Адаптация и сопровождение")}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <p className={styles.text}>
        {t(
          "adaptModal.fstText",
          "  Заключения европейских врачей — это экспертное мнение, но они не являются официальным документом в аптеках вашего города..",
        )}
      </p>

      <p className={`${styles.text} ${styles.important}`}>
        <strong>
          {t(
            "adaptModal.secondText",
            " Важно: с нашей формой аудита работают только врачи-партнёры MED EXPERT EU. Сторонние клиники могут отказать в рассмотрении документов евро-образца.",
          )}
        </strong>
      </p>

      <p className={styles.text}>
        {t("adaptModal.list.title", "Адаптация и сопровождение")}
        <br />• {t("adaptModal.list.one", "Адаптирует назначение в рецепты")}
        <br />• {t("adaptModal.list.two", "Направит на процедуры и анализы")}
        <br />• {t("adaptModal.list.three", "Возьмёт лечение под контроль")}
      </p>

      <div className={styles.actions}>
        <Button className={styles.partnerButton} onClick={handleOpenPartner}>
          {t(
            "adaptModal.button",
            "Подобрать врача-партнёра (Telegram) Ссылĸа: https://t.me/m/rewJBA2PMDgy",
          )}
        </Button>
      </div>
    </Modal>
  );
};
