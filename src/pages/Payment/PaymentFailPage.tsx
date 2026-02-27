import React from "react";
import { Result, Button, Card, Typography } from "antd";
import { useNavigate } from "react-router";
import { CloseCircleFilled } from "@ant-design/icons";
import styles from "./PaymentResult.module.scss";

const { Text, Title } = Typography;

const PaymentFailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Card className={styles.resultCard}>
        <Result
          status="error"
          icon={<CloseCircleFilled style={{ color: "#F87171" }} />}
          title={<Title level={3}>Ошибка оплаты</Title>}
          subTitle={
            <div className={styles.subTitle}>
              <Text type="secondary">
                К сожалению, не удалось провести платёж.
              </Text>
              <br />
              <Text type="secondary">
                Пожалуйста, проверьте данные карты или попробуйте позже.
              </Text>
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="retry"
              size="large"
              danger
              className={styles.primaryButton}
              onClick={() => navigate(-1)}
            >
              Попробовать снова
            </Button>,
            <Button
              key="home"
              size="large"
              className={styles.secondaryButton}
              onClick={() => navigate("/home")}
            >
              На главную
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};

export default PaymentFailPage;
