import { environment } from '@env/environment';
import { RequestInfo } from 'angular-in-memory-web-api';

export function is(reqInfo: RequestInfo, path: string) {
  if (environment.baseUrl) {
    return false;
  }

  return new RegExp(`${path}(/)?$`, 'i').test(reqInfo.req.url);
}