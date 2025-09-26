import { ThinkingProgressPayload } from 'types/thinkingProgress';
import { CanvasContent } from 'types/canvas';

export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  OPEN_CANVAS = 'open_canvas',
  THINKING_PROGRESS = 'thinking_progress',
}

export enum ClientToServerEvent {
  JOIN_ROOM = 'join_room',
}

export interface ServerToClientEventPayloadMap {
  [SocketEvent.CONNECT]: undefined;
  [SocketEvent.DISCONNECT]: undefined;
  [SocketEvent.THINKING_PROGRESS]: { event: any; data: ThinkingProgressPayload };
  [SocketEvent.OPEN_CANVAS]: CanvasContent;
}

type SocketEventHandler = (data: Record<string, unknown>) => void;

export type ServerToClientEvents = {
  [E in SocketEvent]: SocketEventHandler;
};

export interface ClientToServerEventPayloadMap {
  [ClientToServerEvent.JOIN_ROOM]: { channel: string };
}

export type ClientToServerEvents = {
  [E in ClientToServerEvent]: (payload: ClientToServerEventPayloadMap[E]) => void;
};

export type NotificationCallback<E extends SocketEvent> = (
  notification: ServerToClientEventPayloadMap[E],
) => void;

export type RegisterCallback<E extends SocketEvent> = (
  callback: NotificationCallback<E>,
) => () => void;

export type EventHandlerConfig<E extends SocketEvent> = {
  registry?: Set<NotificationCallback<E>>;
  handler?: (payload: ServerToClientEventPayloadMap[E]) => void;
};
