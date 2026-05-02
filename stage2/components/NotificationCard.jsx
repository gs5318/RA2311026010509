"use client";
import { Card, CardContent, Typography, Chip, Box, Tooltip } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useViewed } from "../context/ViewedContext";

const typeConfig = {
  Placement: { color: "success", icon: <WorkIcon fontSize="small" /> },
  Result:    { color: "warning", icon: <EmojiEventsIcon fontSize="small" /> },
  Event:     { color: "primary", icon: <EventIcon fontSize="small" /> },
};

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationCard({ notification }) {
  const { markViewed, isViewed } = useViewed();
  const viewed = isViewed(notification.ID);
  const config = typeConfig[notification.Type] || { color: "default", icon: null };

  return (
    <Card
      onClick={() => markViewed(notification.ID)}
      sx={{
        mb: 1.5,
        cursor: "pointer",
        border: "1px solid",
        borderColor: viewed ? "#21262d" : "primary.main",
        bgcolor: viewed ? "background.paper" : "#1a2233",
        transition: "all 0.2s ease",
        "&:hover": { borderColor: "primary.light", transform: "translateY(-1px)" },
        opacity: viewed ? 0.7 : 1,
      }}
    >
      <CardContent sx={{ py: "12px !important" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          {!viewed && (
            <FiberManualRecordIcon sx={{ fontSize: 10, color: "primary.main" }} />
          )}
          <Chip
            icon={config.icon}
            label={notification.Type}
            color={config.color}
            size="small"
            variant={viewed ? "outlined" : "filled"}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
            {timeAgo(notification.Timestamp)}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 0.5, textTransform: "capitalize", fontWeight: viewed ? 400 : 600 }}>
          {notification.Message}
        </Typography>
        <Tooltip title={notification.ID}>
          <Typography variant="caption" color="text.disabled" noWrap sx={{ display: "block", mt: 0.3 }}>
            {notification.ID}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
