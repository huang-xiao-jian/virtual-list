// package
import { lorem, random } from 'faker';

export const DynamicRecords: LoremRecord[] = new Array(5000)
  .fill('')
  .map((_, index) => ({
    index: `${index}`,
    // 裁剪保证 alert 高度固定
    textContent: `${lorem.sentence(
      random.number({ min: 5, max: 100 })
    )} ${index}`,
  }));
