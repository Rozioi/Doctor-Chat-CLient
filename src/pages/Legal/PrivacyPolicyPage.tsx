import React from "react";
import { Typography } from "antd";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import styles from "./LegalPage.module.scss";

const { Title, Paragraph } = Typography;

const PrivacyPolicyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div onClick={() => navigate(-1)} className={styles.backButton}>
                <IoIosArrowBack />
            </div>
            <div className={styles.content}>
                <Title level={2}>Политика конфиденциальности</Title>
                <Paragraph>
                    Настоящая Политика конфиденциальности описывает, как сервис "Doctor-Chat"
                    (далее — Сервис) собирает, использует и защищает информацию о
                    пользователях.
                </Paragraph>

                <Title level={4}>1. Сбор информации</Title>
                <Paragraph>
                    1.1. Мы собираем данные, которые вы предоставляете при регистрации: имя,
                    номер телефона, а также данные из вашего профиля Telegram.
                    <br />
                    1.2. При использовании Сервиса мы можем собирать информацию о ваших
                    консультациях и загруженных медицинских документах.
                </Paragraph>

                <Title level={4}>2. Использование информации</Title>
                <Paragraph>
                    2.1. Информация используется исключительно для оказания медицинских
                    консультаций и обеспечения работы Сервиса.
                    <br />
                    2.2. Мы не передаем ваши персональные данные третьим лицам, за
                    исключением случаев, предусмотренных законодательством Республики
                    Казахстан.
                </Paragraph>

                <Title level={4}>3. Защита данных</Title>
                <Paragraph>
                    3.1. Мы принимаем все необходимые технические и организационные меры для
                    защиты ваших данных от несанкционированного доступа.
                </Paragraph>

                <Title level={4}>4. Права пользователя</Title>
                <Paragraph>
                    4.1. Вы имеете право получить информацию о том, как обрабатываются ваши
                    данные, а также требовать их удаления или исправления.
                </Paragraph>

                <Title level={4}>5. Изменения политики</Title>
                <Paragraph>
                    5.1. Мы можем обновлять политику конфиденциальности. Изменения вступают
                    в силу с момента их публикации в приложении.
                </Paragraph>

                <Title level={4}>6. Контакты</Title>
                <Paragraph>
                    6.1. По всем вопросам обработки данных вы можете обратиться в службу
                    поддержки через Telegram-бот.
                </Paragraph>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
