import { getAuthToken } from '@/utils/auth'
import { reactive } from 'vue'
import type { ConversationMsgResponse, SendMsgRequest } from '@/models/conversation.ts'

class WebSocketService {
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // ms
  public messages = reactive<ConversationMsgResponse[]>([])

  public connected = false
  private authToken: string | null = null

  constructor(private userId: string) {
    // Get auth token
    this.authToken = getAuthToken()
    this.connected = false
  }

  // Init connection
  connect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected')
      return
    }
    // Set url
    const envWsUrl = (import.meta as any).env?.VITE_WS_URL as string | undefined
    const wsUrl = envWsUrl && envWsUrl.length > 0
      ? envWsUrl
      : (import.meta.env.DEV
        ? 'ws://127.0.0.1:8080/ws'
        : `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`)
    // Create connect
    this.socket = new WebSocket(wsUrl)
  
    this.socket.onopen = () => {
      this.connected = true
      this.reconnectAttempts = 0
      this.sendAuthMessage()
    }

    this.socket.onmessage = (event) => {
      try {
        const message: ConversationMsgResponse = JSON.parse(event.data)
        // handle ack message
        if (message.type === 'ack') {
            // find tmp message to update
            const originalIndex = this.messages.findIndex(
              msg => msg.id === message.clientTmpId
            );
            if (originalIndex !== -1) {
              // update tmp message
              this.messages[originalIndex].status = message.status;
              if (message.status === 'success') {
                this.messages[originalIndex].id = message.actualId;
                this.messages[originalIndex].actualId = message.actualId;
              }
            }
        } else {
          // push tmp message
          this.messages.push(message);
        }
      } catch (error) {
        console.error('parse ws message error:', error)
      }
    }

    this.socket.onclose = (event) => {
      console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`)
      if (this.connected && typeof this.connected === 'object' && 'value' in this.connected) {
        this.connected = false
      } else {
        console.error('connected is not a valid ref object')
      }
      this.reconnect()
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error occurred:', error)
      this.connected = false
      this.socket?.close()
      this.reconnect()
    }
  }

  // Reconnect
  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Try reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)) // 指数退避策略
    } else {
      console.error('Max reconnect attempts reached, stop reconnect')
    }
  }

  // Send message
  sendMessage(message: SendMsgRequest): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message, socket not connected')
      return
    }

    this.socket.send(JSON.stringify(message))
  }

  // Send auth message
  private sendAuthMessage(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('cannot send auth message, socket connect error')
      return
    }

    // Get token
    this.authToken = getAuthToken()

    if (!this.authToken) {
      console.error('cannot send auth message, auth token error')
      return
    }

    const authMessage = {
      type: 'auth',
      token: this.authToken
    }

    this.socket.send(JSON.stringify(authMessage))
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}
export default WebSocketService