export const buildServerUrl = (namespace: string) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.host;
    return `${protocol}//${host}`;
}; 