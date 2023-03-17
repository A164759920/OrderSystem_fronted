/**
 * 配置url白名单
 */
const DOMAIN = "http://127.0.0.1:8888";
const allowedList = new Map([
  [`${DOMAIN}/login`, true],
  [`${DOMAIN}/register`, true],
  [`${DOMAIN}/test`, true],
]);

export { allowedList, DOMAIN };
