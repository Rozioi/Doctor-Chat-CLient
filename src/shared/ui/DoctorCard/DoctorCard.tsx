import { memo } from "react";
import { Card, Avatar } from "antd";
import styles from "./DoctorCard.module.scss";

interface DoctorCardProps {
  name: string;
  country: string;
  countryFlag: string;
  rating: number;
  image: string;
  onSelect?: () => void;
  onMouseEnter?: () => void;
  selected?: boolean;
}

export const DoctorCard = memo<DoctorCardProps>(
  ({
    name,
    country,
    countryFlag,
    rating,
    image,
    onSelect,
    onMouseEnter,
    selected,
  }) => {
    return (
      <Card
        className={`${styles.card} ${selected ? styles.selected : ""}`}
        onClick={onSelect}
        onMouseEnter={onMouseEnter}
        variant="borderless"
      >
        <div className={styles.content}>
          <Avatar size={50} src={image} />
          <div className={styles.info}>
            <div className={styles.name}>{name}</div>
            <div className={styles.country}>
              Из {country} <span>{countryFlag}</span>
            </div>
          </div>
          <div className={styles.rating}>
            <span>⭐ {rating}</span>
          </div>
        </div>
      </Card>
    );
  },
);
