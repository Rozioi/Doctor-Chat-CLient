import React, { useEffect, useState } from "react";
import { Result, Button, Card, Typography, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircleFilled } from "@ant-design/icons";
import styles from "./PaymentResult.module.scss";

const { Text, Title } = Typography;

const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<{
        orderId: string;
        amount: string | null;
    } | null>(null);

    const invId = searchParams.get("InvId");

    useEffect(() => {
        // In a real scenario, we might want to poll the backend for final status
        // For now, we'll assume it's successful if Robokassa redirected here
        if (invId) {
            // Simulate API call to verify status
            setTimeout(() => {
                setLoading(false);
                setPaymentData({
                    orderId: invId,
                    amount: searchParams.get("OutSum"),
                });
            }, 1500);
        } else {
            setLoading(false);
        }
    }, [invId, searchParams]);

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <Spin size="large" tip="Проверка платежа..." />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Card className={styles.resultCard}>
                <Result
                    status="success"
                    icon={<CheckCircleFilled style={{ color: "#34D399" }} />}
                    title={<Title level={3}>Оплата прошла успешно!</Title>}
                    subTitle={
                        <div className={styles.subTitle}>
                            <Text type="secondary">
                                Ваш платеж №{invId || "N/A"} принят в обработку.
                            </Text>
                            <br />
                            <Text strong>Сумма: {paymentData?.amount || "0"} ₸</Text>
                        </div>
                    }
                    extra={[
                        <Button
                            type="primary"
                            key="home"
                            size="large"
                            className={styles.primaryButton}
                            onClick={() => navigate("/home")}
                        >
                            Вернуться на главную
                        </Button>,
                        <Button
                            key="chats"
                            size="large"
                            className={styles.secondaryButton}
                            onClick={() => navigate("/chat")}
                        >
                            Перейти к консультациям
                        </Button>,
                    ]}
                />
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
