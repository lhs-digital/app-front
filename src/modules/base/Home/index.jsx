import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "LHS - Home";
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Home placeholder component */}
    </div>
  );
};

export default Home;
