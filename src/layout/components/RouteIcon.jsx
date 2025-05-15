const iconStyles = {
  fontSize: "small",
};

export const routeIcon = (item, active) => {
  if (!item) return null;
  const { icon: Icon, activeIcon: ActiveIcon } = item;
  if (!Icon) return null;
  if (!ActiveIcon) return <Icon {...iconStyles} />;
  return active ? <ActiveIcon {...iconStyles} /> : <Icon {...iconStyles} />;
};
