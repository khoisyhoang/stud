# DeepWork Map - API Endpoints

## Core APIs
```
GET    /api/sessions              - Get all sessions (with lat/lng/radius filters)
GET    /api/sessions/:id          - Get session details
POST   /api/sessions              - Create new session
PUT    /api/sessions/:id          - Update session (host only)
DELETE /api/sessions/:id          - Delete session (host only)

GET    /api/sessions/:id/messages - Get chat messages
POST   /api/sessions/:id/messages - Send message
GET    /api/sessions/:id/participants - Get participants
POST   /api/sessions/:id/join   - Join session
POST   /api/sessions/:id/leave  - Leave session

POST   /api/auth/register         - User registration
POST   /api/auth/login            - User login
POST   /api/auth/logout           - User logout

GET    /api/users/profile         - Get current user profile
PUT    /api/users/profile         - Update profile
GET    /api/users/:id            - Get user details
```

## Additional APIs
```
GET    /api/sessions/nearby     - Get sessions near location
GET    /api/sessions/active      - Get active sessions only
POST   /api/sessions/:id/start  - Start session (host)
POST   /api/sessions/:id/end    - End session (host)
GET    /api/users/sessions       - Get user's sessions
```

## Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## Error Format
```json
{
  "success": false,
  "error": "Session not found",
  "code": "SESSION_NOT_FOUND"
}
```
