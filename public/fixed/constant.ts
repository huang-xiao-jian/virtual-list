// package
import { lorem } from 'faker';

export const FixedRecords: LoremRecord[] = new Array(5000)
  .fill('')
  .map((_, index) => ({
    index: `${index}`,
    // 裁剪保证 alert 高度固定
    textContent: `${lorem.sentence(35).slice(0, 125)} ${index}`,
  }));
