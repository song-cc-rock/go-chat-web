// 定义一个常量对象
export const AUTH_BASE = {
  github: 'https://github.com/login/oauth/authorize?',
  wechat: 'https://open.weixin.qq.com/connect/qrconnect?',
} as const;

export type AuthType = keyof typeof AUTH_BASE;

export function getBaseAuthByType(type: AuthType): string {
  return AUTH_BASE[type];
}
