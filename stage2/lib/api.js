import axios from "axios";

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

function scoreNotification(n) {
  const weight = TYPE_WEIGHT[n.Type] || 0;
  const ts = new Date(n.Timestamp).getTime();
  return weight * 1e12 + ts;
}

export async function getNotifications({ limit, page, notification_type, token }) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", limit);
  if (page) params.set("page", page);
  if (notification_type) params.set("notification_type", notification_type);

  const res = await axios.get(`/api/notifications?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.notifications || [];
}

export function computeTopN(notifications, n = 10) {
  return [...notifications]
    .map((item) => ({ ...item, _score: scoreNotification(item) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, n);
}