# WhatsApp Automation Dashboard (Learn Build)

SvelteKit learning project for small-business WhatsApp automation workflows.

The app is intentionally mock-first so you can learn the full dashboard architecture before integrating a live provider.

## Stack

- SvelteKit 2 + Svelte 5 (runes mode)
- TypeScript
- Tailwind CSS v4
- In-memory mock service layer (no DB in MVP)

## Run Locally

```sh
npm install
npm run dev
```

Quality checks:

```sh
npm run check
npm run lint
```

## Feature Routes

- `/dashboard` - overview KPIs + simulation event feed
- `/dashboard/contacts` - contacts CRUD form (create + list)
- `/dashboard/campaigns` - campaign composer + send-now action
- `/dashboard/scheduling` - schedule queue creation + list
- `/dashboard/analytics` - status-based performance metrics

## API Routes (Mock)

- `GET/POST /api/contacts`
- `GET/POST /api/campaigns`
- `GET/POST /api/schedules`
- `POST /api/messages/send`
- `GET /api/status`
- `POST /api/webhooks/simulate`
- `GET/POST /api/webhooks/whatsapp`

## Environment Variables (Phase 4)

- `WHATSAPP_API_TOKEN` - Meta Cloud API access token
- `WHATSAPP_PHONE_NUMBER_ID` - Meta phone number id
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` - token used in webhook verification challenge
- `WHATSAPP_APP_SECRET` - app secret used for `x-hub-signature-256` validation

Provider behavior:

- If `WHATSAPP_API_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are present, app uses Meta provider.
- Otherwise app automatically falls back to mock provider.

## Phase Checklist

### Phase 1 - Foundation and Skeleton

- [x] Domain types and shared models
- [x] Dashboard route layout and navigation
- [x] Mock store for contacts, campaigns, schedules, events

### Phase 2 - Mock API and End-to-End Flows

- [x] API endpoints for contacts/campaigns/schedules/status
- [x] Server `load` + `actions` for dashboard pages
- [x] Campaign composer with recipient selection
- [x] Send-now workflow via `/api/messages/send`
- [x] Scheduling workflow via `/api/schedules`
- [x] Webhook simulation and event generation
- [x] KPI/event updates with timed refresh polling
- [x] Validation baseline: `npm run check` and `npm run lint` pass

### Phase 3 - UX and Learning Instrumentation

- [x] Dashboard KPIs and analytics cards
- [x] Loading/empty/error/success interaction states
- [x] In-app learning notes/comments across boundaries

### Phase 4 - Real Integration Bridge

- [x] Provider interface (`sendMessage`, `verifyWebhookSignature`, `parseStatusEvents`)
- [x] Env-gated provider resolution (mock default, Meta when configured)
- [x] Meta webhook verification route (`GET/POST /api/webhooks/whatsapp`)
- [x] Meta status payload mapping to internal delivery statuses
- [x] Send flow records provider message ids for webhook status correlation
- [ ] Live Meta sandbox smoke test with real credentials (optional, environment-dependent)

## Manual Smoke Test (Phase 2)

1. Create one or more contacts in `/dashboard/contacts`.
2. Create a campaign and select recipients in `/dashboard/campaigns`.
3. Click `Send now` on a campaign.
4. Open `/dashboard` and trigger simulation events.
5. Confirm KPIs and event feed update over time.
6. Open `/dashboard/scheduling` and create a scheduled send.
7. Open `/dashboard/analytics` and verify read/delivery rates refresh.

## Next Phase

Phase 5 focuses on wrap-up: document lessons learned, known limitations, and prioritized backlog for persistence/auth/retry upgrades.
