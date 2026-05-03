export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'secreto_temporal',
  accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
};