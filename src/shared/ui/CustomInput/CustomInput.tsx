import type { FC, ChangeEvent } from "react";
import { Input } from "antd";
import styles from "./CustomInput.module.scss";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

interface CustomInputProps {
  type?: "text" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

export const CustomInput: FC<CustomInputProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className={styles.wrapper}>
      {type === "password" ? (
        <Input.Password
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          {...rest}
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
      )}
    </div>
  );
};
