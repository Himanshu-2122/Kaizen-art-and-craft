export {}; // ⭐ VERY IMPORTANT (makes file a module)

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
      };
    }
  }
}
