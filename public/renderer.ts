export function renderItem(record: LoremRecord) {
  const ele = document.createElement('div');

  ele.setAttribute('class', 'alert alert-primary');

  ele.dataset.index = record.index;
  // 初始化触发标记
  ele.dataset.status = 'pending';
  // 原始数据控制长度，保证容器高度固定
  ele.textContent = record.textContent;

  return ele;
}

export function patchItem(record: LoremRecord, element: HTMLElement) {
  element.dataset.index = record.index;
  element.textContent = record.textContent;

  return element;
}
