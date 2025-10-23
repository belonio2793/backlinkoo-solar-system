export function installSafeWebSocketPatch() {
  if (typeof window === 'undefined') return;

  try {
    const OriginalWebSocket = (window as any).WebSocket;
    if (!OriginalWebSocket) return;

    const allowedHosts = ['localhost', '127.0.0.1'];

    class StubWebSocket {
      url: string;
      readyState: number = 3; // CLOSED
      onopen: any = null;
      onmessage: any = null;
      onerror: any = null;
      onclose: any = null;
      constructor(url: string) {
        this.url = url;
        console.warn('⚠️ Blocked external WebSocket in sandboxed preview:', url);
        // schedule a noop close to mimic a closed socket
        setTimeout(() => {
          if (this.onclose) try { this.onclose({ code: 1006, reason: 'blocked' }); } catch (e) {}
        }, 0);
      }
      send() { /* noop */ }
      close() { /* noop */ }
      addEventListener() { /* noop */ }
      removeEventListener() { /* noop */ }
    }

    (window as any).WebSocket = function (url: string, protocols?: string | string[]) {
      try {
        const host = (new URL(url)).hostname;
        const isAllowed = allowedHosts.some(h => host.includes(h));
        if (!isAllowed) {
          return new StubWebSocket(url) as any;
        }
      } catch (e) {
        // If URL parsing fails, block to be safe
        return new StubWebSocket(String(url)) as any;
      }

      // @ts-ignore
      return new OriginalWebSocket(url, protocols);
    } as any;

    console.log('✅ Safe WebSocket patch installed');
  } catch (error) {
    console.warn('⚠️ Safe WebSocket patch failed:', (error as any).message || error);
  }
}
