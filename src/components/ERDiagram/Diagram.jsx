import { Masonry } from "@mui/lab";
import { TransformComponent } from "react-zoom-pan-pinch";
import EREntity from "./EREntity";

const Diagram = ({ data, allowHover = false, onSelectTable = () => {} }) => {
  return (
    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
      <Masonry
        columns={{
          xs: 1,
          sm: 3,
          lg: 4,
          xl: 5,
        }}
        spacing={6}
        style={{ width: "1500px" }}
      >
        {data.map((item) => (
          <EREntity
            key={item.name}
            table={item}
            allowHover={allowHover}
            onClick={() => {
              onSelectTable(item);
            }}
          />
        ))}
      </Masonry>
    </TransformComponent>
  );
};

export default Diagram;
