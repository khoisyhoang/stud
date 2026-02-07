# DeepWork Map - MVP Database Design

## Overview
MVP database design for DeepWork Map - a location-based study session platform that enables users to find, join, and host virtual study sessions.

## Database Architecture
- **Primary Database**: PostgreSQL (for relational data)
- **Cache Layer**: Redis (for real-time data, sessions, chat)
- **Search**: PostgreSQL with PostGIS (for location-based search)

---

## Core MVP Tables

### 1. Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 2. Study_Sessions
```sql
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('silent', 'discussion', 'exam-prep')),
    status VARCHAR(20) NOT NULL DEFAULT 'starting-soon' CHECK (status IN ('starting-soon', 'live', 'finished')),
    
    -- Location data
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Timing
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    
    -- Capacity
    max_participants INTEGER NOT NULL DEFAULT 10 CHECK (max_participants > 0),
    current_participants INTEGER NOT NULL DEFAULT 0 CHECK (current_participants >= 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_host ON study_sessions(host_id);
CREATE INDEX idx_sessions_status ON study_sessions(status) WHERE status IN ('starting-soon', 'live');
CREATE INDEX idx_sessions_time ON study_sessions(start_time);
CREATE INDEX idx_sessions_location ON study_sessions USING GIST (
    ll_to_earth(latitude, longitude)
);
```

### 3. Session_Participants
```sql
CREATE TABLE session_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'participant' CHECK (role IN ('host', 'participant')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE(session_id, user_id)
);

-- Indexes
CREATE INDEX idx_participants_session ON session_participants(session_id);
CREATE INDEX idx_participants_user ON session_participants(user_id);
CREATE INDEX idx_participants_active ON session_participants(session_id, is_active) WHERE is_active = TRUE;
```

### 4. Chat_Messages
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for real-time queries
CREATE INDEX idx_chat_session_time ON chat_messages(session_id, created_at DESC);
CREATE INDEX idx_chat_user ON chat_messages(user_id, created_at DESC);
```

---

## Basic Views for Common Queries

### 1. Active Sessions with Host Info
```sql
CREATE VIEW active_sessions_view AS
SELECT 
    s.*,
    u.username as host_username,
    u.display_name as host_display_name,
    u.avatar_url as host_avatar
FROM study_sessions s
JOIN users u ON s.host_id = u.id
WHERE s.status IN ('starting-soon', 'live')
ORDER BY s.start_time;
```

### 2. Session Participants List
```sql
CREATE VIEW session_participants_view AS
SELECT 
    sp.*,
    u.username,
    u.display_name,
    u.avatar_url
FROM session_participants sp
JOIN users u ON sp.user_id = u.id
WHERE sp.is_active = TRUE;
```

---

## Redis Caching Strategy (MVP)

### 1. Active Sessions Cache
```
Key: active_sessions
TTL: 5 minutes
Data: JSON array of active sessions with basic info
```

### 2. Session Details Cache
```
Key: session:{session_id}
TTL: 1 hour
Data: JSON with session details and participants
```

### 3. Chat Messages
```
Key: chat:{session_id}
TTL: 2 hours
Data: Last 50 messages in session
```

---

## Basic API Queries (MVP)

### 1. Get Sessions by Location
```sql
SELECT * FROM active_sessions_view 
WHERE ST_DWithin(
    ll_to_earth(latitude, longitude),
    ll_to_earth(:user_lat, :user_lng),
    :radius_km * 1000
)
ORDER BY start_time
LIMIT 50;
```

### 2. Join Session
```sql
INSERT INTO session_participants (session_id, user_id, role)
VALUES (:session_id, :user_id, 'participant')
ON CONFLICT (session_id, user_id) DO NOTHING;

UPDATE study_sessions 
SET current_participants = current_participants + 1
WHERE id = :session_id;
```

### 3. Send Chat Message
```sql
INSERT INTO chat_messages (session_id, user_id, content)
VALUES (:session_id, :user_id, :content)
RETURNING *;
```

### 4. Get Session Messages
```sql
SELECT cm.*, u.username, u.display_name, u.avatar_url
FROM chat_messages cm
JOIN users u ON cm.user_id = u.id
WHERE cm.session_id = :session_id
ORDER BY cm.created_at DESC
LIMIT 50;
```

---

## Data Types Mapping

### Session Types
- `silent` - Silent focus sessions
- `discussion` - Collaborative study sessions  
- `exam-prep` - Exam preparation sessions

### Session Status
- `starting-soon` - Scheduled but not started
- `live` - Currently active
- `finished` - Session ended

### User Roles
- `host` - Session creator
- `participant` - Session attendee

---

## MVP Features Supported

✅ **User Authentication**
- User registration and login
- Basic profile management

✅ **Session Management**
- Create study sessions
- Find sessions by location
- Join/leave sessions

✅ **Real-time Chat**
- Session-based messaging
- Message history

✅ **Geographic Search**
- Location-based session discovery
- Distance calculations

---

## Simple Security (MVP)

### 1. Basic Authentication
- Password hashing with bcrypt
- JWT tokens for API access
- Session management

### 2. Data Validation
- Input sanitization
- SQL injection prevention
- Basic rate limiting

### 3. Privacy Controls
- User can only join public sessions
- Chat access limited to participants
- Basic data encryption

---

## Scaling Considerations (MVP)

### 1. Database Optimization
- Proper indexing on frequently queried columns
- Connection pooling
- Read replica for chat queries

### 2. Caching Strategy
- Redis for active sessions
- Cache session participants
- Message history caching

### 3. Geographic Performance
- PostGIS for efficient location queries
- Bounding box filtering
- Session clustering for dense areas

---

This MVP database design provides the essential foundation for the DeepWork Map application while keeping the complexity minimal. It supports all current features and can be extended as the product grows.
