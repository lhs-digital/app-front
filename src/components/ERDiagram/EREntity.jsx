import { Key } from "@mui/icons-material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const EREntity = ({ table, allowHover = false, onClick = () => {} }) => {
  return (
    <motion.div
      initial={{
        outline: "0px solid transparent",
        outlineOffset: "6px",
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      }}
      onClick={() => {
        if (allowHover && !table.hasModule) {
          onClick();
        }
      }}
      whileHover={
        allowHover && !table.hasModule
          ? {
              outline: "3px solid var(--foreground-color)",
              outlineOffset: "6px",
            }
          : {}
      }
      whileTap={allowHover && !table.hasModule ? { scale: 0.95 } : {}}
      className={`bg-[--background-color] w-48 border z-0 border-[--border] flex flex-col
                  items-center rounded-lg shadow-lg transition-all duration-200 ease-in-out ${
                    allowHover
                      ? table.hasModule
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-100 cursor-pointer"
                      : ""
                  }`}
    >
      <div className="w-full py-1 bg-gray-500/10 border-b border-[--border] flex items-center justify-center">
        {table.name}
      </div>
      <div className="w-full flex flex-col gap-1 [&>*:not(:last-child)]:border-b">
        {table.columns.map((column) => (
          <div
            className="flex flex-row w-full p-1 items-center justify-between border-[--border] relative"
            key={column.name}
          >
            <div className="w-12 flex items-center justify-center ">
              {column.pk && (
                <div className="absolute translate-x-[1px] right-0 flex flex-col items-center justify-center pl-1 rounded-l-full border-[--border] border-y border-l h-5 w-4 outline-l-2 outline-red-500 bg-[--background-color]">
                  <div className="h-2 w-2 ml-0.5 bg-[--border] rounded-full" />
                </div>
              )}
              {column.pk && <Key sx={{ fontSize: 18 }} />}
              {column.fk && (
                <div className="absolute -left-1 -translate-y-[0.1rem] flex flex-col items-center justify-center pr-1 rounded-r-full border-[--border] border-y border-r h-5 w-4 translate-x-[0.2rem] outline-l-2 outline-red-500 bg-[--background-color]">
                  <div className="h-2 w-2 mr-0.5 bg-[--border] rounded-full" />
                </div>
              )}
            </div>
            <div className="w-full" key={column.name}>
              <p>{column.name}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

EREntity.propTypes = {
  table: PropTypes.shape({
    name: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        pk: PropTypes.bool.isRequired,
        fk: PropTypes.bool.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default EREntity;
