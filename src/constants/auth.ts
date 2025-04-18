// 定义一个常量对象
export const AUTH_BASE = {
  github: 'https://github.com/login/oauth/authorize?',
  wechat: 'https://open.weixin.qq.com/connect/qrconnect?',
} as const;

export function getBaseAuthByType(type: string): string {
  switch (type) {
    case 'github':
      return AUTH_BASE.github;
    case 'wechat':
      return AUTH_BASE.wechat;
    default:
      return AUTH_BASE.github;
  }
}
