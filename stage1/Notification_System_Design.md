# Stage 1

## Priority Inbox — Approach & Design

### Problem
Students miss important notifications because they are buried under a large volume of lower-priority ones. The goal is to always surface the top **n** most important unread notifications (n = 10 by default).

---

### Scoring Strategy

Each notification gets a numeric **score** that combines two signals:

| Signal   | How it's used |
|----------|---------------|
| **Type weight** | Placement = 3, Result = 2, Event = 1 |
| **Recency** | Unix timestamp in milliseconds |

**Formula:**
```
score = typeWeight * 1_000_000_000_000 + unixTimestampMs
```

Multiplying the weight by 1 trillion ensures type always dominates over recency, but among notifications of the same type, the newer one ranks higher.

---

### Efficient Top-N Maintenance (`BoundedTopList`)

A **BoundedTopList** class holds at most `n` items at any time:

1. When a new notification arrives, it is scored and inserted.
2. The list is sorted in descending order of score.
3. If the list exceeds `n`, the lowest-scored item is dropped.

**Why this works for streaming notifications:**
- New notifications keep arriving in real time.
- We never need to re-sort the entire historical list.
- Memory stays bounded at O(n) regardless of total notification count.

For production scale, this can be upgraded to a **min-heap of size n** (O(log n) insert vs O(n log n) sort), but for the current dataset size the sorted-array approach is clear and correct.

---

### API Integration

- The notifications are fetched from the provided protected GET endpoint.
- Authorization is passed via a Bearer token in the request header.
- The `AUTH_TOKEN` environment variable is used to avoid hardcoding secrets.

---

### How to Run

```bash
npm install
AUTH_TOKEN=your_actual_token node priorityInbox.js
```

---

### Output

The program prints the top 10 notifications ranked by priority, showing ID, Type, Message, Timestamp, and Score.
