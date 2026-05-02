"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Typography, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Alert,
  Pagination, TextField, Button, Stack
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Navbar from "../components/Navbar";
import NotificationCard from "../components/NotificationCard";
import { getNotifications } from "../lib/api";

const TYPES = ["All", "Placement", "Result", "Event"];
const LIMITS = [5, 10, 15, 20];

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [token, setToken] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await getNotifications({
        limit,
        page,
        notification_type: filterType === "All" ? undefined : filterType,
        token,
      });
      setNotifications(data);
      setTotalPages(Math.max(1, Math.ceil((data.length === limit ? page * limit + 1 : page * limit) / limit)));
    } catch (err) {
      setError("Failed to fetch notifications. Check your token or network.");
    } finally {
      setLoading(false);
    }
  }, [token, limit, page, filterType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Notifications
        </Typography>

        {/* Token input */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <TextField
            label="Bearer Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            size="small"
            type="password"
            fullWidth
            placeholder="Paste your auth token here"
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={!token || loading}
          >
            Fetch
          </Button>
        </Stack>

        {/* Filters */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} label="Type" onChange={(e) => { setFilterType(e.target.value); setPage(1); }}>
              {TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Per Page</InputLabel>
            <Select value={limit} label="Per Page" onChange={(e) => { setLimit(e.target.value); setPage(1); }}>
              {LIMITS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {notifications.length === 0 && !error && (
              <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                {token ? "No notifications found." : "Enter your token above and click Fetch."}
              </Typography>
            )}
            {notifications.map((n) => (
              <NotificationCard key={n.ID} notification={n} />
            ))}
          </>
        )}

        {notifications.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </>
  );
}
