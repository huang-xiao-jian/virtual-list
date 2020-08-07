// package
import { lorem, random } from 'faker';

interface Record {
  index: string;
  textContent: string;
}

export const FixedRecords: Record[] = new Array(5000)
  .fill('')
  .map((_, index) => ({
    index: `${index}`,
    // 裁剪保证 alert 高度固定
    textContent: `${lorem.sentence(35).slice(0, 125)} ${index}`,
  }));

export const Records: Record[] = new Array(5000).fill('').map((_, index) => ({
  index: `${index}`,
  // 裁剪保证 alert 高度固定
  textContent: `${lorem.sentence(random.number({ min: 4, max: 30 }))} ${index}`,
}));

export function renderItem(record: Record) {
  const ele = document.createElement('div');

  ele.setAttribute('class', 'alert alert-primary');

  ele.dataset.index = record.index;
  // 初始化触发标记
  ele.dataset.status = 'pending';
  // 原始数据控制长度，保证容器高度固定
  ele.textContent = record.textContent;

  return ele;
}

export function patchItem(record: Record, element: HTMLElement) {
  element.dataset.index = record.index;
  element.textContent = record.textContent;

  return element;
}
