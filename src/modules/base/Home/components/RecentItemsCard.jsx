import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from "@mui/material";

const RecentItemsCard = ({
  title,
  items,
  isLoading,
  onItemClick,
  getItemLabel,
  icon,
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <div className="flex flex-row gap-2 items-center mb-4">
        {icon}
        <h2 className="font-medium">{title}</h2>
      </div>
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={24} />
        </Box>
      ) : items?.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={1}>
          {items.map((item, index) => (
            <CardActionArea
              key={item.id || index}
              onClick={() => onItemClick?.(item)}
              sx={{
                p: 1.5,
                borderRadius: 1.75,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <p className="text-sm">{getItemLabel(item)}</p>
            </CardActionArea>
          ))}
        </Box>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">
          Nenhum item recente
        </p>
      )}
    </CardContent>
  </Card>
);

export default RecentItemsCard;
