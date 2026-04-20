<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Artinventory Next.js App Router application. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.js` to route events through `/ingest` for improved ad-blocker resistance. A server-side PostHog client (`src/lib/posthog-server.ts`) was created for API route tracking. Environment variables were written to `.env.local`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in — also calls `posthog.identify` | `src/components/forms/index.tsx` |
| `user_registered` | New user completed registration — also calls `posthog.identify` | `src/components/forms/index.tsx` |
| `art_piece_added` | User added a new art piece to the inventory | `src/components/addnew.tsx` |
| `art_piece_updated` | User edited and saved an existing art piece | `src/components/edit.tsx` |
| `art_pieces_sold` | User confirmed selling one or more art pieces to a customer | `src/components/sell.tsx` |
| `feedback_submitted` | User submitted feedback (feature, function, or error type) | `src/components/feedback.tsx` |
| `art_pieces_sold_completed` | Server-side: sale of art pieces was completed successfully | `src/app/api/sellpieces/route.ts` |
| `art_piece_created` | Server-side: art piece was successfully created in the database | `src/app/api/artpiece/route.ts` |
| `art_piece_deleted` | Server-side: art piece was successfully deleted from the inventory | `src/app/api/artpiece/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/162546/dashboard/631195
- **Login & Registration trend**: https://eu.posthog.com/project/162546/insights/seAnYL23
- **Sales funnel: Select → Confirm → Complete**: https://eu.posthog.com/project/162546/insights/amUAHwhl
- **Art piece inventory activity**: https://eu.posthog.com/project/162546/insights/kuuKhz7w
- **Feedback submissions by type**: https://eu.posthog.com/project/162546/insights/pI8swtNE
- **User retention after registration**: https://eu.posthog.com/project/162546/insights/UTpFJ2jB

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
