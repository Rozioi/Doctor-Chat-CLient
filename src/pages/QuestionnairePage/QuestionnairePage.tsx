import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Typography,
  Card,
  message,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import styles from "./QuestionnairePage.module.scss";
import { apiClient } from "../../api/api";
import type { QuestionnairePayload } from "../../api/api";
import { tg } from "../../shared/lib/telegram";

const { Title, Text } = Typography;
const { TextArea } = Input;

const MAX_FILE_SIZE_MB = 20;

const QuestionnairePage: React.FC = () => {
  useEffect(() => {
    console.log("fsafafasf");
  }, []);
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: File) => {
    const isValidSize = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;

    if (!isValidSize) {
      message.error(`Файл должен быть меньше ${MAX_FILE_SIZE_MB}MB`);
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleSubmit = async (values: any) => {
    if (!orderId) return;

    try {
      setLoading(true);

      const telegramId = tg.initDataUnsafe?.user?.id?.toString();

      if (!telegramId) {
        message.error("Пользователь не авторизован в Telegram");
        setLoading(false);
        return;
      }

      let uploadedFileUrls: string[] = [];

      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append("files", file.originFileObj);
          }
        });

        const uploadRes = await apiClient.uploadQuestionnaireFiles(
          Number(orderId),
          formData,
        );
        if (uploadRes.success && uploadRes.data) {
          uploadedFileUrls = uploadRes.data;
        }
      }

      // 2. Create the questionnaire with the file URLs
      const payload: QuestionnairePayload = {
        fullName: values.fullName,
        birthDate: values.birthDate
          ? dayjs(values.birthDate).format("YYYY-MM-DD")
          : null,
        location: values.location,
        mainRequest: values.mainRequest,
        history: values.history,
        currentTherapy: values.currentTherapy,
        allergies: values.allergies,
        fileUrls: uploadedFileUrls,
      };

      const questionnaireRes = await apiClient.createQuestionnaire({
        orderId: Number(orderId),
        payload,
        telegramId,
      });

      if (!questionnaireRes.success) {
        message.error("Не удалось отправить анкету: " + questionnaireRes.error);
        return;
      }

      message.success("Анкета успешно отправлена!");

      setTimeout(() => {
        tg.close();
      }, 1500);

      navigate(`/chat`);
    } catch (error: any) {
      console.error(error);
      message.error("Ошибка отправки анкеты: " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={3}>Анкета клиента MED EXPERT EU</Title>
        <Text type="secondary">
          (Предварительное описание ситуации для получения «Второго мнения»)
        </Text>

        <Divider />

        <Text>
          ✅ Ваша оплата успешно подтверждена.
          <br />
          Для подготовки эксперта к аналитической сессии и обеспечения точности
          рекомендаций, пожалуйста, заполните данную форму.
        </Text>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* ================== Блок 1 ================== */}
          <Title level={5}>Блок 1. Идентификация</Title>

          <Form.Item
            name="fullName"
            label="ФИО"
            rules={[{ required: true, message: "Введите ФИО" }]}
          >
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>

          <Form.Item name="birthDate" label="Дата рождения">
            <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Страна и город"
            rules={[{ required: true, message: "Укажите страну и город" }]}
          >
            <Input placeholder="Германия, Берлин" />
          </Form.Item>

          <Divider />

          {/* ================== Блок 2 ================== */}
          <Title level={5}>Блок 2. Описание ситуации</Title>

          <Form.Item
            name="mainRequest"
            label="Основной запрос"
            rules={[
              {
                required: true,
                message:
                  "Опишите проблему и главный вопрос к европейскому эксперту",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Опишите проблему и главный вопрос к европейскому эксперту"
            />
          </Form.Item>

          <Form.Item name="history" label="Предыстория и ранее принятые меры">
            <TextArea
              rows={4}
              placeholder="Первые симптомы, прошлое лечение, эффект"
            />
          </Form.Item>

          <Form.Item name="currentTherapy" label="Текущая терапия">
            <TextArea rows={3} placeholder="Препараты, БАДы, витамины" />
          </Form.Item>

          <Form.Item name="allergies" label="Индивидуальная непереносимость">
            <Input placeholder="Аллергические реакции на лекарства / продукты" />
          </Form.Item>

          <Divider />

          {/* ================== Блок 3 ================== */}
          <Title level={5}>Блок 3. Файлы</Title>

          <Text type="warning">
            ⚠ ВНИМАНИЕ: Врачи-эксперты MED EXPERT EU принимают документы для
            анализа на русском, английском или немецком языках.
          </Text>

          <br />
          <br />

          <Upload
            beforeUpload={beforeUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <Button icon={<UploadOutlined />}>📎 + Загрузить файлы</Button>
          </Upload>

          <Text type="secondary" style={{ fontSize: 12 }}>
            (Форматы: PDF, JPG, PNG. Макс. размер: до 20 МБ)
          </Text>

          <Divider />

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
          >
            Отправить врачу и перейти в чат
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default QuestionnairePage;
