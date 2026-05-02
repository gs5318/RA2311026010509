const axios = require("axios");

// Weight map: higher number = more important
const typeWeight = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// Score each notification using its type weight and how recent it is
function buildScore(notification) {
  const weight = typeWeight[notification.Type] || 0;
  const timeValue = new Date(notification.Timestamp).getTime();
  // Combine weight (scaled up) and recency so both matter
  return weight * 1e12 + timeValue;
}

// Keep a max-heap of size n so we always hold the top n efficiently
class BoundedTopList {
  constructor(limit) {
    this.limit = limit;
    this.items = [];
  }

  add(notification) {
    const scored = { ...notification, _score: buildScore(notification) };
    this.items.push(scored);
    // Sort descending by score and trim to limit
    this.items.sort((a, b) => b._score - a._score);
    if (this.items.length > this.limit) {
      this.items.pop();
    }
  }

  getTop() {
    return this.items;
  }
}

async function fetchNotifications(apiUrl, token) {
  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.notifications;
}

async function runPriorityInbox() {
  const API_URL =
    "http://20.207.122.201/evaluation-service/notifications";

  // Replace with your actual bearer token
  const TOKEN = process.env.AUTH_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnczUzMThAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjcxNywiaWF0IjoxNzc3NzAxODE3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiM2MzZDZkMzgtYTg4Yy00Mzk0LTk5OTAtNmQwOGNjODI1MjZmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicyBnYWdhbiIsInN1YiI6IjFjZTRlNTI4LTNjNmEtNGFiOS1iNmQ0LTRiNzE5ZjAzM2M0ZCJ9LCJlbWFpbCI6ImdzNTMxOEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InMgZ2FnYW4iLCJyb2xsTm8iOiJyYTIzMTEwMjYwMTA1MDkiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIxY2U0ZTUyOC0zYzZhLTRhYjktYjZkNC00YjcxOWYwMzNjNGQiLCJjbGllbnRTZWNyZXQiOiJ5Y3ROeHB3ZUNEd2F4TWZSIn0.InJZn6fAR6lQ82Zc9i_mdtjehOyh-zTggopvMOGAWq4";

  const TOP_N = 10;

  let allNotifications;
  try {
    allNotifications = await fetchNotifications(API_URL, TOKEN);
  } catch (err) {
    console.error("Could not reach notification API:", err.message);
    process.exit(1);
  }

  console.log(`Total notifications fetched: ${allNotifications.length}\n`);

  const inbox = new BoundedTopList(TOP_N);

  // Stream them in one by one (simulates new notifications arriving)
  for (const n of allNotifications) {
    inbox.add(n);
  }

  const topNotifications = inbox.getTop();

  console.log(`===== Top ${TOP_N} Priority Notifications =====\n`);
  topNotifications.forEach((n, idx) => {
    console.log(`#${idx + 1}`);
    console.log(`  ID       : ${n.ID}`);
    console.log(`  Type     : ${n.Type}`);
    console.log(`  Message  : ${n.Message}`);
    console.log(`  Timestamp: ${n.Timestamp}`);
    console.log(`  Score    : ${n._score}`);
    console.log("");
  });
}

runPriorityInbox();
