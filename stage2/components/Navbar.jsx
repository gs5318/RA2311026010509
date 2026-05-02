"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid #21262d", bgcolor: "background.paper" }}>
      <Toolbar sx={{ gap: 2 }}>
        <NotificationsIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6" sx={{ flexGrow: 1, color: "text.primary", letterSpacing: "-0.5px" }}>
          Campus<span style={{ color: "#4f8ef7" }}>Notify</span>
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<NotificationsIcon />}
            variant={pathname === "/" ? "contained" : "text"}
            size="small"
          >
            All
          </Button>
          <Button
            component={Link}
            href="/priority"
            startIcon={<StarIcon />}
            variant={pathname === "/priority" ? "contained" : "text"}
            size="small"
            color="secondary"
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
