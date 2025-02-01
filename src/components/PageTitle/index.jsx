const Index = ({ title, subtitle = "", buttons = <></> }) => {
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div>
        <div className="flex flex-row items-center gap-4 text-xl font-bold">
          {title}
        </div>
        <div className="text-gray-400">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">{buttons}</div>
    </div>
  );
};

export default Index;
