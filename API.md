# API Reference (`/api`)

All endpoints under `/api/*` require authentication via the `X-Token` header (a session token previously returned by the public `/papi/*` auth endpoints). Public/auth endpoints under `/papi/*` are not documented here.

**Common conventions:**
- `Auth` row: header(s) the route reads
- **Mandatory** = request fails with a 4xx if the field is absent
- **Optional** = field is read but absent values use a default or simply skip a code path
- Status codes: `401` = missing/invalid `X-Token`; `417` = missing/invalid required field (the project uses `417 Expectation Failed` rather than `400` for validation errors); `419` is used in one place (`DELETE /api/category` for missing `id`); `500` = unhandled exception

---

## `/api/addmediatoartpiece`

| Method | Body type | Mandatory | Optional |
|---|---|---|---|
| `PATCH` | JSON | `selections` (string[]), `artPieceId` (string) | – |

Status: `200` ok, `401`, `417` missing field, `500`.

---

## `/api/artpiece`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | `id` (string) | – |
| `POST` | `multipart/form-data` | `title`, **one of**: `document` (File) **or** `imageId` (string) | any other form fields are persisted as art-piece metadata |
| `PATCH` | `multipart/form-data` | `title`, `artPieceId` | `document` (File replaces image), any other fields → metadata |
| `DELETE` | query | `artPieceId` | – |

Status: `200`, `401`, `404` (PATCH/DELETE — id not owned by user), `417` missing field, `500`.

---

## `/api/artpieces`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Returns all art pieces for the authenticated user. Status: `200`, `401`.

---

## `/api/artpiecesale`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Returns art pieces marked for sale. Status: `200`, `401`.

---

## `/api/catalog`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | JSON body + query | `catalog` (`singlepage` \| `imagelist` \| `listicon` \| `list` \| `twolist`); **at least one of** `selectedList` (string[]) **or** `list` (string) in body | Query: `fields[name]`, `fields[media]`, `fields[dimensions]`, `fields[year]`, `fields[price]`, `fields[description]`, `fields[frontCover]`, `fields[backCover]` (each `"true"` or `"false"`) |

Returns a PDF binary. Status: `200`, `401`, `404` (user / pieces / invalid layout), `417` missing field, `500`.

---

## `/api/categories`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | – | `type` (string; if `"all"` returns every category type) |

Status: `200`, `401`.

---

## `/api/category`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | JSON | `label`, `value`, `type` | – |
| `DELETE` | query | `id` | `force` (`"true"` to delete even when category is in use) |

Status: `200`, `401`, `417` (POST missing field, or DELETE category in use without force), `419` (DELETE missing `id`), `500`.

---

## `/api/customer`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | `id` | – |
| `POST` | JSON | `name` | `_id` (presence triggers update, absence triggers create); any other fields stored on customer record |
| `DELETE` | query | `id` | – |

Status: `200`, `401`, `404` (GET/DELETE not found), `417` missing field, `500`.

---

## `/api/customers`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Status: `200`, `401`, `404` (no customers).

---

## `/api/download`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | `type` (`"data"` for CSV, `"images"` for ZIP) | – |

Status: `200`, `401`, `404` (user not found), `417` missing/invalid `type`, `501` (`images` not implemented).

---

## `/api/feedback`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | – | `id` (filter to a single feedback record) |
| `POST` | JSON | `option`, `description` | – |

Status: `200`, `401`, `417` (POST missing field), `500`.

---

## `/api/folder`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | JSON | `folder` (must not start with `__profile`) | – |
| `DELETE` | query | `folder` (must not start with `__profile`) | – |

`__profile/...` paths are reserved for avatars and are rejected. Status: `200`, `401`, `417`, `500`.

---

## `/api/folders`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Returns the user's S3 folder tree (excluding `__profile`). Status: `200`, `401`.

---

## `/api/image`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | `image` (S3 key/filename) | `h` (height), `w` (width) — when present, the image is resized |

Status: `200`, `401`, `417` missing `image`.

---

## `/api/media`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | `multipart/form-data` | `document` (File), `name` | `folder` (defaults to `/`); any other form fields persisted as media metadata |
| `DELETE` | query | `mediaId` | – |

Status: `200`, `401`, `404` (DELETE not found), `417` missing field, `500`.

---

## `/api/movemedia`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | JSON | `destination` (must not start with `__profile`), `mediaId` | – |

Status: `200`, `401`, `404`, `417`.

---

## `/api/orderartpieces`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | JSON | `ids` (string[]) — must be an array; reordering follows array order | – |

Status: `200`, `401`, `417` (`ids` not an array).

---

## `/api/pictures`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Status: `200`, `401`.

---

## `/api/profile`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |
| `POST` | `multipart/form-data` | – | `document` (File, profile avatar); any other form fields are persisted on the user record |

Status: `200`, `401`, `403` (GET — user not found), `500`.

---

## `/api/reports`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Status: `200`, `401`.

---

## `/api/security/qr`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | – | header `X-Token` (also serves as auth) | – |

Generates an RSA-2048 keypair, signs a payload referencing the session, persists the security artifacts on the session record, and returns `{ qr: <signed JSON string> }`. Status: `200`, `400` (missing `X-Token`), `401`, `500`.

---

## `/api/selection`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | `id` | – |
| `PATCH` | JSON | `selectionId`, `ids` (string[] of art-piece ids to remove) | – |
| `DELETE` | query | `id` | – |

Status: `200`, `401`, `404` (DELETE not found), `417` missing/invalid field.

---

## `/api/selections`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |
| `PATCH` | JSON | `selections` (string[]), **and one of** `name` (creates a new selection) **or** `selectionId` (updates an existing selection) | – |
| `PUT` | JSON | `selections` (string[]), `selectionId` — replaces the selection's contents | – |

Status: `200`, `401`, `417`.

---

## `/api/sellpieces`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `POST` | JSON | `customerId` (string), `artPieces` (object whose keys identify art pieces; values carry sale metadata) | – |

Status: `200`, `401`, `417`.

---

## `/api/show`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | query | `id` | – |
| `DELETE` | query | `id` | – |

Status: `200`, `401`, `404`, `417`.

---

## `/api/shows`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |
| `POST` | JSON | `name` | `_id` (presence triggers update, absence triggers create); any other fields persisted on show record |

Status: `200`, `401`, `417` (POST missing `name`), `500`.

---

## `/api/statistics`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Status: `200`, `401`.

---

## `/api/validsession`

| Method | Input | Mandatory | Optional |
|---|---|---|---|
| `GET` | – | – | – |

Use to verify the current `X-Token` is still valid. Status: `200`, `401`.

---

# Running the test suite

Tests live in `frontend/tests/`. They exercise each route end-to-end against a real MongoDB instance (see `tests/setup/`).

```sh
cd frontend
npm install            # installs jest + ts-jest dev deps
npm test               # runs all tests
npm run test:single    # serial mode (helpful when debugging session state)
```

**Required env (read from `frontend/.env.local` or shell):**
- `MONGO_SERVER` — same URI used by the app (`<PASSWORD>` placeholder is substituted automatically).
- `MONGO_PASSWORD`
- Optional `TEST_MONGO_SERVER` / `TEST_MONGO_PASSWORD` to point tests at a different cluster
- Optional `MONGO_TEST_DB` (defaults to `artinventory_test`)
- Optional `KEEP_TEST_DB=1` to skip teardown of the test DB

The S3 layer (`@/server/s3`), `sharp`, and the PostHog client are mocked in `tests/setup/__mocks__/` — tests do not perform real S3 uploads or analytics calls.
