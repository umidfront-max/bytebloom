// WebSocket (STOMP + SockJS) orqali server → klient push.
// Klient bu kanal orqali hech narsa YUBORMAYDI — yuborish doim REST POST bilan.
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import { apiUrl } from './client'

export function connectChat({ shortId, onMessage, onStatus }) {
  let sub
  const client = new Client({
    webSocketFactory: () => new SockJS(apiUrl('/ws')),
    reconnectDelay: 4000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      sub = client.subscribe(`/topic/chat/${shortId}`, (frame) => {
        try { onMessage(JSON.parse(frame.body)) } catch { /* noto'g'ri frame — e'tiborsiz */ }
      })
      onStatus('online')
    },
    onWebSocketClose: () => onStatus('offline'),
    onStompError: () => onStatus('offline'),
  })

  client.activate()

  return {
    stop() {
      try { sub?.unsubscribe() } catch { /* ulanish allaqachon yopilgan */ }
      client.deactivate()
    },
  }
}
