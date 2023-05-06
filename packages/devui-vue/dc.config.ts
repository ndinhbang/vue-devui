// @ts-ignore
import { defineCliConfig } from 'devui-cli';

export default defineCliConfig({
  componentRootDir: './devui',
  libClassPrefix: 'b',
  libEntryFileName: 'vue-devui',
  libEntryRootDir: './devui',
  libPrefix: 'D',
  libStyleFileSuffix: '.scss'
});
