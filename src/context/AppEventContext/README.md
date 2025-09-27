# AppEventContext with Channel Support

A comprehensive Socket.IO-based event management system with channel support for React applications. This context provides real-time communication capabilities with proper channel isolation, user authentication, and type-safe event handling.

## Features

- ✅ **Channel-based Communication**: Isolated channels for users, courses, sessions, and global events
- ✅ **Type-Safe Events**: Full TypeScript support with typed event payloads
- ✅ **Dual Event System**: Global and channel-specific event registration
- ✅ **Environment Configuration**: Support for development, production, and testing environments
- ✅ **Automatic Reconnection**: Robust connection management with retry logic
- ✅ **Memory Management**: Automatic cleanup of event listeners and channels
- ✅ **Error Handling**: Comprehensive error handling and logging

## Architecture Overview

### Channel Types

```typescript
enum ChannelType {
  USER = 'user', // User-specific events
  COURSE = 'course', // Course-specific events
  SESSION = 'session', // AI session-specific events
  GLOBAL = 'global', // Global application events
}
```

### Supported Events

```typescript
enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  OPEN_CANVAS = 'open_canvas',
  UPDATE_CANVAS = 'update_canvas',
  THINKING_PROGRESS = 'thinking_progress',
  OPEN_CREATE_COURSE_MODAL = 'open_create_course_modal',
  // Channel management
  JOIN_CHANNEL = 'join_channel',
  LEAVE_CHANNEL = 'leave_channel',
  CHANNEL_JOINED = 'channel_joined',
  CHANNEL_LEFT = 'channel_left',
  CHANNEL_ERROR = 'channel_error',
}
```

## Quick Start

### 1. Basic Setup

```tsx
import { AppEventContextProvider, SocketConfigFactory } from 'context/AppEventContext';

function App() {
  const socketConfig = SocketConfigFactory.forEnvironment();

  return (
    <AppEventContextProvider socketConfig={socketConfig}>
      <YourAppComponents />
    </AppEventContextProvider>
  );
}
```

### 2. Using the Context

```tsx
import { useAppEventContext, AppEvent, AppChannelType } from 'context/AppEventContext';
import { ChannelConfigFactory } from 'context/AppEventContext/config';

function CourseComponent({ courseId, userId }) {
  const { isConnected, joinChannel, leaveChannel, registerChannelEventCallback } =
    useAppEventContext();

  useEffect(() => {
    if (!isConnected) return;

    // Join course-specific channel
    const joinCourseChannel = async () => {
      const courseConfig = ChannelConfigFactory.course(courseId, {
        permissions: ['read', 'write'],
        role: 'instructor',
      });

      const success = await joinChannel(courseConfig);
      if (success) {
        console.log(`Joined course channel: ${courseId}`);
      }
    };

    joinCourseChannel();

    return () => {
      leaveChannel(`course:${courseId}`);
    };
  }, [isConnected, courseId, joinChannel, leaveChannel]);

  // Register for course-specific events
  useEffect(() => {
    const channelName = `course:${courseId}`;

    const unregister = registerChannelEventCallback(
      channelName,
      AppEvent.THINKING_PROGRESS,
      (data, channel) => {
        console.log(`Progress update for ${channel}:`, data);
        // Handle thinking progress for this specific course
      },
    );

    return unregister;
  }, [courseId, registerChannelEventCallback]);

  return <div>Course Component</div>;
}
```

## Configuration

### Environment-based Configuration

```typescript
import { SocketConfigFactory } from 'context/AppEventContext/config';

// Development configuration
const devConfig = SocketConfigFactory.development();

// Production configuration
const prodConfig = SocketConfigFactory.production();

// Custom configuration
const customConfig = SocketConfigFactory.custom({
  url: 'wss://your-api.com/socket',
  auth: {
    token: 'your-auth-token',
    userId: 'user-123',
  },
  options: {
    reconnectionAttempts: 3,
    timeout: 10000,
  },
});
```

### Environment Variables

```bash
# Socket configuration
REACT_APP_SOCKET_URL=wss://your-api.com/socket
REACT_APP_SOCKET_TOKEN=your-auth-token
REACT_APP_USER_ID=user-123
```

## API Reference

### Hook: `useAppEventContext()`

Returns an object with the following properties and methods:

#### Properties

- `isConnected: boolean` - Socket connection status
- `joinedChannels: Map<string, ChannelInfo>` - Currently joined channels

#### Methods

##### Global Event Registration

```typescript
registerEventCallback<E extends SocketEvent>(
  event: E,
  callback: NotificationCallback<E>
) => () => void
```

##### Channel Management

```typescript
joinChannel(config: ChannelConfig) => Promise<boolean>
leaveChannel(channelName: string) => Promise<boolean>
isChannelJoined(channelName: string) => boolean
```

##### Channel-specific Event Registration

```typescript
registerChannelEventCallback<E extends SocketEvent>(
  channelName: string,
  event: E,
  callback: ChannelNotificationCallback<E>
) => () => void
```

##### Utility Methods

```typescript
getChannelInfo(channelName: string) => ChannelInfo | undefined
getAllChannels() => ChannelInfo[]
```

## Channel Management

### Creating Channels

```typescript
import { ChannelConfigFactory } from 'context/AppEventContext/config';

// User channel
const userConfig = ChannelConfigFactory.user('user-123', {
  role: 'instructor',
  permissions: ['read', 'write'],
});

// Course channel
const courseConfig = ChannelConfigFactory.course('course-456', {
  semester: 'fall-2024',
  department: 'computer-science',
});

// Session channel (for AI interactions)
const sessionConfig = ChannelConfigFactory.session('session-789', {
  type: 'course-generation',
  startTime: Date.now(),
});
```

### Channel Naming Convention

Channels follow the pattern: `{type}:{id}`

- User channel: `user:123`
- Course channel: `course:cs101`
- Session channel: `session:ai-gen-456`
- Global channel: `global:announcements`

## Event Handling Patterns

### 1. Global Events

Events that affect all users (connection status, global announcements)

```typescript
const unregister = registerEventCallback(AppEvent.CONNECT, () => {
  console.log('Connected to server');
});
```

### 2. Channel-specific Events

Events that only affect users in specific channels

```typescript
const unregister = registerChannelEventCallback(
  'course:cs101',
  AppEvent.THINKING_PROGRESS,
  (data, channel) => {
    console.log(`AI progress in ${channel}:`, data);
  },
);
```

### 3. Multi-channel Registration

Register for the same event across multiple channels

```typescript
const channels = getAllChannels();
const unregisterFunctions = channels.map((channel) =>
  registerChannelEventCallback(channel.name, AppEvent.OPEN_CANVAS, (data, channelName) => {
    console.log(`Canvas opened in ${channelName}`);
  }),
);

// Cleanup
const cleanup = () => unregisterFunctions.forEach((fn) => fn());
```

## Error Handling

### Connection Errors

```typescript
useEffect(() => {
  if (!isConnected) {
    console.warn('Socket disconnected - some features may be unavailable');
  }
}, [isConnected]);
```

### Channel Join Errors

```typescript
const joinWithRetry = async (channelConfig, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const success = await joinChannel(channelConfig);
      if (success) return true;

      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      console.error(`Join attempt ${i + 1} failed:`, error);
    }
  }
  return false;
};
```

## Best Practices

### 1. Channel Lifecycle Management

```typescript
useEffect(() => {
  // Join channels on mount
  const setupChannels = async () => {
    await joinChannel(ChannelConfigFactory.user(userId));
    await joinChannel(ChannelConfigFactory.course(courseId));
  };

  if (isConnected) {
    setupChannels();
  }

  // Cleanup on unmount
  return () => {
    leaveChannel(`user:${userId}`);
    leaveChannel(`course:${courseId}`);
  };
}, [isConnected, userId, courseId]);
```

### 2. Event Registration Cleanup

```typescript
useEffect(() => {
  const unregisterFunctions = [
    registerChannelEventCallback(channelName, AppEvent.EVENT1, handler1),
    registerChannelEventCallback(channelName, AppEvent.EVENT2, handler2),
  ];

  return () => {
    unregisterFunctions.forEach((fn) => fn());
  };
}, [channelName]);
```

### 3. Conditional Event Handling

```typescript
const registerEventsBasedOnRole = (userRole) => {
  const unregisterFunctions = [];

  // All users get basic events
  unregisterFunctions.push(
    registerChannelEventCallback(channelName, AppEvent.THINKING_PROGRESS, handleProgress),
  );

  // Only instructors get admin events
  if (userRole === 'instructor') {
    unregisterFunctions.push(
      registerChannelEventCallback(channelName, AppEvent.UPDATE_CANVAS, handleCanvasUpdate),
    );
  }

  return () => unregisterFunctions.forEach((fn) => fn());
};
```

## Testing

### Mock Configuration for Tests

```typescript
import { SocketConfigFactory } from 'context/AppEventContext/config';

const testConfig = SocketConfigFactory.testing();

// Use in test setup
<AppEventContextProvider socketConfig={testConfig}>
  <ComponentUnderTest />
</AppEventContextProvider>
```

## Migration from Previous Version

### Before (Global Events Only)

```typescript
const { registerEventCallback } = useAppEventContext();

useEffect(() => {
  const unregister = registerEventCallback(AppEvent.THINKING_PROGRESS, (data) => {
    // Received all thinking progress events
  });
  return unregister;
}, []);
```

### After (Channel-specific Events)

```typescript
const { joinChannel, registerChannelEventCallback } = useAppEventContext();

useEffect(() => {
  // Join specific channel first
  joinChannel(ChannelConfigFactory.session(sessionId));

  // Register for channel-specific events
  const unregister = registerChannelEventCallback(
    `session:${sessionId}`,
    AppEvent.THINKING_PROGRESS,
    (data, channel) => {
      // Only receive events for this specific session
    },
  );

  return unregister;
}, [sessionId]);
```

## Troubleshooting

### Common Issues

1. **Events not received**: Ensure you've joined the correct channel
2. **Memory leaks**: Always return cleanup functions from useEffect
3. **Connection issues**: Check socket URL and authentication token
4. **Type errors**: Ensure you're using the correct event types and payloads

### Debug Mode

Enable debug logging by setting:

```bash
REACT_APP_DEBUG_SOCKET=true
```

## Performance Considerations

- **Channel Cleanup**: Automatically leave channels when components unmount
- **Event Batching**: Multiple events in the same channel are efficiently batched
- **Memory Management**: Event listeners are automatically cleaned up
- **Reconnection**: Smart reconnection logic prevents unnecessary reconnections

## Server-side Requirements

Your Socket.IO server should support:

- Room/channel joining and leaving
- Channel-specific event emission
- Authentication via token
- Event payload structure with optional `channel` field

Example server-side channel support:

```javascript
// Server-side channel management
socket.on('join_channel', ({ channel, config }) => {
  socket.join(channel);
  socket.emit('channel_joined', { channel, info: config });
});

// Emit to specific channel
io.to('course:cs101').emit('thinking_progress', {
  data: progressData,
  channel: 'course:cs101',
});
```

This implementation provides a robust, scalable foundation for real-time communication in your application with proper isolation and type safety.

