export function getRealIP(req: any): string {
  const xForwardedFor = req.headers[
    'x-forwarded-for'
  ] as string;
  const xRealIP = req.headers[
    'x-real-ip'
  ] as string;
  const cfConnectingIP = req.headers[
    'cf-connecting-ip'
  ] as string;
  const xClientIP = req.headers[
    'x-client-ip'
  ] as string;

  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  if (cfConnectingIP) return cfConnectingIP;
  if (xRealIP) return xRealIP;
  if (xClientIP) return xClientIP;

  return (
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    '0.0.0.0'
  );
}

export function isLocalhost(ip: string): boolean {
  const localhostIPs = [
    '127.0.0.1',
    '::1',
    'localhost',
    '0.0.0.0',
    '::ffff:127.0.0.1',
    '10.0.0.0', // Docker
    '172.17.0.1', // Docker
    '192.168.150.22', // local server
  ];

  return (
    localhostIPs.includes(ip) ||
    ip.startsWith('103.189.')
  );
}
