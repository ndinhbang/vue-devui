import cssVars from 'css-vars-ponyfill';
import { Subscription } from 'rxjs';
import { THEME_KEY } from './key-config';
import { Theme } from './theme';
import { devuiDarkTheme, devuiLightTheme } from './theme-data';
import { ThemeService } from './theme-service';
import { EventBus } from './utils';

/**
 * usage
 * main.ts
 ```ts
 import { ThemeServiceInit } from 'devui-theme';
 ThemeServiceInit();
 ```
 *
*/
export function ThemeServiceInit(
  themes?: { [themeName: string]: Theme },
  defaultThemeName?: string,
  extraData?: {
    [themeName: string]: {
      appendClasses?: Array<string>;
      cssVariables?: {
        [cssVarName: string]: string;
      };
    };
  },
  ieSupport = false, // TODO：css-var-ponyflll 仍有一些问题待定位
  allowDynamicTheme = false
) {
  if (typeof window === 'undefined') {
    return null;
  }

  // @ts-ignore
  window[THEME_KEY.themeCollection] = themes || {
    'devui-light-theme': devuiLightTheme,
    'devui-dark-theme': devuiDarkTheme,
  };
  // @ts-ignore
  window[THEME_KEY.currentTheme] = defaultThemeName || 'devui-light-theme';
  // @ts-ignore
  const eventBus = window['globalEventBus'] || new EventBus(); // window.globalEventBus 为 框架的事件总线
  const themeService = new ThemeService(eventBus);
  // @ts-ignore
  window[THEME_KEY.themeService] = themeService;

  themeService.setExtraData(extraData || {
    'devui-dark-theme': {
      appendClasses: ['dark-mode']
    }
  });
  themeService.initializeTheme(undefined, allowDynamicTheme);
  if (ieSupport) {
    ieSupportCssVar();
  }
  return themeService;
}

export function ThemeServiceFollowSystemOn(themeConfig?: { lightThemeName: string; darkThemeName: string }): Subscription | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // @ts-ignore
  const themeService: ThemeService = window[THEME_KEY.themeService];
  themeService.registerMediaQuery();
  // @ts-ignore
  return themeService.mediaQuery.prefersColorSchemeChange.subscribe(value => {
    if (value === 'dark') {
      // @ts-ignore
      themeService.applyTheme(window[THEME_KEY.themeCollection][themeConfig && themeConfig.darkThemeName || 'devui-dark-theme']);
    } else {
      // @ts-ignore
      themeService.applyTheme(window[THEME_KEY.themeCollection][themeConfig && themeConfig.lightThemeName || 'devui-light-theme']);
    }
  });
}
export function ThemeServiceFollowSystemOff(sub?: Subscription) {
  if (typeof window === 'undefined') {
    return null;
  }

  if (sub) {
    sub.unsubscribe();
  }
  // @ts-ignore
  const themeService = window[THEME_KEY.themeService];
  themeService.unregisterMediaQuery();
}

export function ieSupportCssVar() {
  if (typeof window === 'undefined') {
    return null;
  }

  const isNativeSupport = window['CSS'] && CSS.supports && CSS.supports('(--a: 0)') || false;
  if (isNativeSupport) { return; }
  cssVars({ watch: true, silent: true });
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      cssVars({ watch: false, silent: true });
      cssVars({ watch: true, silent: true });
    });
  });

  const config = { attributes: true, attributeFilter: [THEME_KEY.uiThemeAttributeName] };

  // @ts-ignore
  observer.observe(document.querySelector(`#${THEME_KEY.styleElementId}`), config);
}

// TODO: management should handle add / remove theme from theme collection.
// TODO: move global variables（window.xxxx） to single namespace
