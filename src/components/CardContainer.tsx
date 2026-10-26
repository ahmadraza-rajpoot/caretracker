import { NotebookPen } from "lucide-react";
import Card from "./Card";

const CardContainer = () => {
  const cardData = [
    {
      title: "Total Audits",
      count: 24,
      icon: NotebookPen,
    },
    {
      title: "Pending Audits",
      count: 8,
      icon: NotebookPen,
    },
    {
      title: "Completed Audits",
      count: 16,
      icon: NotebookPen,
    },
    {
      title: "Findings",
      count: 12,
      icon: NotebookPen,
    },
  ];

  return (
    <div className="flex w-full gap-4">
      {cardData.map((item) => (
        <Card key={item.title} title={item.title} count={item.count} icon={item.icon} />
      ))}
    </div>
  );
};

export default CardContainer;