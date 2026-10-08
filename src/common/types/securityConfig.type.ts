export type SecurityConfig = {
  rateLimit: {
    max: number;
    windowMs: number;
  };
  cors: {
    credentials: boolean;
    origin: string | boolean | string[];
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    maxAge: number;
  };
  jwtSecret?: string;
  jwtExpiresIn?: string;
  blacklistedIps?: string[];
};
