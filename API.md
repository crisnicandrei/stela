# API Documentation

- Path: `<host>/api/v2`

## Directives

### POST `/directive`

- Headers: Content-Type: application/json, Authorization: Bearer \<JWT from FusionAuth>
- Request Body

```
{
  archiveId: string,
  stewardEmail: string (email format),
  type: string (must be "transfer" presently),
  note: string (optional),
  trigger: {
    type: string (must be "admin" presently)
  }
}
```

- Response

```
{
  directiveId: string,
  archiveId: string,
  type: string,
  createdDt: string (date),
  updatedDt: string (date),
  trigger: {
    directiveTriggerId: string,
    directiveId: string,
    type: string,
    createdDt: string (date),
    updatedDt: string (date),
  },
  stewardAccountId: string,
  note: string,
  executionDt: string (date)
}
```

### POST `/directive/trigger/account/:accountId`

- Executes all admin-triggered directives for a given account
- Headers: Authorization: Bearer \<JWT from FusionAuth>
- Response:

```
[
  {
    archiveId: string,
    directiveId: string,
    outcome: string ("error" | "success"),
    errorMessage: string
  }
]
```

### PUT `/directive/:directiveId`

- Headers: Content-Type: application/json, Authorization: Bearer \<JWT from FusionAuth>
- Request Body

```
{
  stewardEmail: string (email format), (optional)
  type: string (must be "transfer" presently) (optional),
  note: string (optional),
  trigger: {
    type: string (must be "admin" presently) (optional)
  } (optional)
}
```

- Response

```
{
  directiveId: string,
  archiveId: string,
  type: string,
  createdDt: string (date),
  updatedDt: string (date),
  trigger: {
    directiveTriggerId: string,
    directiveId: string,
    type: string,
    createdDt: string (date),
    updatedDt: string (date),
  },
  stewardAccountId: string,
  note: string,
  executionDt: string (date)
}
```

### GET `/directive/archive/:archiveId`

- Headers: Authorization: Bearer \<JWT from FusionAuth>
- Response
```
[
  {
    directiveId: string,
    archiveId: string,
    type: string,
    createdDt: string (date),
    updatedDt: string (date),
    trigger: {
      directiveTriggerId: string,
      directiveId: string,
      type: string,
      createdDt: string (date),
      updatedDt: string (date),
    },
    stewardAccountId: string,
    note: string,
    executionDt: string (date)
  }
]
```