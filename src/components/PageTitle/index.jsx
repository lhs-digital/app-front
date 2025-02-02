import { useEffect } from "react";

const Index = ({ title, subtitle = "", buttons = <></> }) => {
  useEffect(() => {
    document.title = `LHS - ${title}`;
  }, [title]);

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div>
        <p className="text-xl font-bold">{title}</p>
        <div className="text-gray-400">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">{buttons}</div>
    </div>
  );
};

export default Index;
