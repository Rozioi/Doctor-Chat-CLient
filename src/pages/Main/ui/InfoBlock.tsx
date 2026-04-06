import { useTranslation } from "react-i18next";
import styles from "../styles/InfoBlock.module.scss";
import { InfoWarningBlock } from "./InfoWarningBlock";
import Slider from "./Slider";

export const InfoBlock = () => {
  const { t } = useTranslation();

  const SliderBlocks = [
    {
      title: t("info.advantages.title"),
      data: [
        {
          title: t("info.advantages.europeanStandards.title"),
          points: [
            t("info.advantages.europeanStandards.point1"),
            t("info.advantages.europeanStandards.point2"),
            t("info.advantages.europeanStandards.point3"),
            t("info.advantages.europeanStandards.point4"),
          ],
          image: "/images/advantages/1.png",
        },
        {
          title: t("info.advantages.speed.title"),
          points: [
            t("info.advantages.speed.point1"),
            t("info.advantages.speed.point2"),
            t("info.advantages.speed.point3"),
          ],
          image: "/images/advantages/2.png",
        },
        {
          title: t("info.advantages.channels.title"),
          points: [
            t("info.advantages.channels.point1"),
            t("info.advantages.channels.point2"),
            t("info.advantages.channels.point3"),
          ],
          image: "/images/advantages/3.png",
        },
        {
          title: t("info.advantages.privacy.title"),
          points: [
            t("info.advantages.privacy.point1"),
            t("info.advantages.privacy.point2"),
            t("info.advantages.privacy.point3"),
            t("info.advantages.privacy.point4"),
          ],
          image: "/images/advantages/4.png",
        },
        {
          title: t("info.advantages.alternative.title"),
          points: [t("info.advantages.alternative.point1")],
          image: "/images/advantages/5.png",
        },
        {
          title: t("info.advantages.feedback.title"),
          points: [
            t("info.advantages.feedback.point1"),
            t("info.advantages.feedback.point2"),
            t("info.advantages.feedback.point3"),
            t("info.advantages.feedback.point4"),
          ],
          image: "/images/advantages/6.png",
        },
        {
          title: t("info.advantages.profit.title"),
          points: [
            t("info.advantages.profit.point1"),
            t("info.advantages.profit.point2"),
            t("info.advantages.profit.point3"),
            t("info.advantages.profit.point4"),
            t("info.advantages.profit.point5"),
          ],
          image: "/images/advantages/1.png",
        },
      ],
    },
    {
      title: t("info.problems.title"),
      data: [
        {
          title: t("info.problems.diagnosis.title"),
          points: [
            t("info.problems.diagnosis.point1"),
            t("info.problems.diagnosis.point2"),
            t("info.problems.diagnosis.point3"),
          ],
          image: "/images/problems/1.png",
        },
        {
          title: t("info.problems.treatment.title"),
          points: [
            t("info.problems.treatment.point1"),
            t("info.problems.treatment.point2"),
            t("info.problems.treatment.point3"),
          ],
          image: "/images/problems/2.png",
        },
        {
          title: t("info.problems.check.title"),
          points: [
            t("info.problems.check.point1"),
            t("info.problems.check.point2"),
          ],
          image: "/images/problems/4.png",
        },
        {
          title: t("info.problems.secondOpinion.title"),
          points: [
            t("info.problems.secondOpinion.point1"),
            t("info.problems.secondOpinion.point2"),
            t("info.problems.secondOpinion.point3"),
          ],
          image: "/images/problems/5.png",
        },
        {
          title: t("info.problems.trust.title"),
          points: [
            t("info.problems.trust.point1"),
            t("info.problems.trust.point2"),
            t("info.problems.trust.point3"),
          ],
          image: "/images/problems/6.png",
        },
      ],
    },
  ];
  return (
    <div className={styles.container}>
      {SliderBlocks.map((block, i) => (
        <Slider key={i} title={block.title} data={block.data} />
      ))}

      <InfoWarningBlock />
    </div>
  );
};
