"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Typography, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Alert,
  TextField, Button, Stack, Paper
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import Navbar from "../../components/Navbar";
import NotificationCard from "../../components/NotificationCard";
import { getNotifications, computeTopN } from "../../lib/api";

const TOP_N_OPTIONS = [5, 10, 15, 20];
const TYPES = ["All", "Placement", "Result", "Event"];

export default function PriorityPage() {
  const [all, setAll] = useState([]);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState("All");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      // Fetch a large batch so we can compute priority client-side
      const data = await getNotifications({ limit: 10, token });
      setAll(data);
    } catch {
      setError("Failed to fetch notifications. Check your token.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = filterType === "All" ? all : all.filter((n) => n.Type === filterType);
  const priorityList = computeTopN(filtered, topN);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <StarIcon sx={{ color: "secondary.main" }} />
          <Typography variant="h4">Priority Inbox</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Showing the most important notifications ranked by type priority and recency.
        </Typography>

        {/* Token */}
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
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={!token || loading}
          >
            Fetch
          </Button>
        </Stack>

        {/* Controls */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Show Top N</InputLabel>
            <Select value={topN} label="Show Top N" onChange={(e) => setTopN(e.target.value)}>
              {TOP_N_OPTIONS.map((n) => <MenuItem key={n} value={n}>Top {n}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Filter Type</InputLabel>
            <Select value={filterType} label="Filter Type" onChange={(e) => setFilterType(e.target.value)}>
              {TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
            {priorityList.length === 0 && !error && (
              <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                {token ? "No notifications found." : "Enter your token above and click Fetch."}
              </Typography>
            )}

            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "transparent", borderColor: "#30363d" }}>
              <Typography variant="caption" color="text.secondary">
                Priority scoring: <strong style={{ color: "#3fb950" }}>Placement</strong> &gt;{" "}
                <strong style={{ color: "#d29922" }}>Result</strong> &gt;{" "}
                <strong style={{ color: "#4f8ef7" }}>Event</strong> — ties broken by recency
              </Typography>
            </Paper>

            {priorityList.map((n, i) => (
              <Box key={n.ID} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ pt: 1.5, color: "text.disabled", minWidth: 22, fontWeight: 700 }}
                >
                  #{i + 1}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <NotificationCard notification={n} />
                </Box>
              </Box>
            ))}
          </>
        )}
      </Container>
    </>
  );
}
