import { IContextService } from './interface';
export class ContextService implements IContextService {
  getDataFromNameSpace(nameSpace: string) {
    if (typeof window === 'undefined') {
      return null;
    }

    // @ts-ignore
    return window[nameSpace];
  }
  setDataFromNameSpace(nameSpace: string, value: any) {
    if (typeof window === 'undefined') {
      return;
    }

    // @ts-ignore
    window[nameSpace] = value;
  }
}
