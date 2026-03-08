import React, { useEffect } from "react";
import { Result, Button, Card, Typography, message } from "antd";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircleFilled } from "@ant-design/icons";
import styles from "./PaymentResult.module.scss";
import { apiClient } from "../../api/api";

const { Text, Title } = Typography;

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const paymentId = Number(searchParams.get("pg_order_id") || 0);

  useEffect(() => {
    const orderIdStr = searchParams.get("pg_order_id");
    if (!orderIdStr) return;

    const paymentId = Number(orderIdStr);
    if (!paymentId || Number.isNaN(paymentId)) return;

    const paymentStatus = searchParams.get("pg_payment_status") || "success";

    apiClient
      .finalizeFreedomPayPayment(paymentId, paymentStatus)
      .then((res) => {
        if (!res.success) {
          messageApi.warning(res.error || "Не удалось обновить статус оплаты");
        }
      })
      .catch(() => {});
  }, [searchParams, messageApi]);

  return (
    <div className={styles.container}>
      {contextHolder}
      <Card className={styles.resultCard}>
        <Result
          status="success"
          icon={<CheckCircleFilled style={{ color: "#34D399" }} />}
          title={<Title level={3}>Оплата прошла успешно!</Title>}
          subTitle={
            <div className={styles.subTitle}>
              <Text type="secondary">
                Платёж принят. В течение пары секунд мы создадим чат с врачом.
              </Text>
              <br />
              <Text type="secondary">
                Чат появится в разделе &laquo;Мои врачи&raquo;.
              </Text>
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="chats"
              size="large"
              className={styles.primaryButton}
              onClick={() => navigate(`/order/${paymentId}/questionnaire`)}
            >
              Перейти к консультациям
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

export default PaymentSuccessPage;
