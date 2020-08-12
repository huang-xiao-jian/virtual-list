/**
 * @description - 动态高度长列表
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// internal
import { DynamicRecords } from './constant';

// scope
const container = document.querySelector('.vl-core') as HTMLElement;
const lastIndex = DynamicRecords.length - 1;

// range
let head = 0;
let tail = 0;
let observerVisible: IntersectionObserver;
let observerBeyond: IntersectionObserver;

export function renderItem(record: LoremRecord) {
  const ele = document.createElement('div');

  ele.setAttribute('class', 'alert alert-primary');

  ele.dataset.index = record.index;
  // 初始化触发标记
  ele.dataset.visible = 'pending';
  ele.dataset.beyond = 'pending';
  // 原始数据控制长度，保证容器高度固定
  ele.textContent = record.textContent;

  return ele;
}

function recycleAboveNodes(entry: IntersectionObserverEntry): void {
  const element = entry.target as HTMLElement;
  const elements: HTMLElement[] = [];

  let cursor = element.previousSibling as HTMLElement;

  while (cursor) {
    // queue
    elements.unshift(cursor);

    // loop
    cursor = cursor.previousSibling as HTMLElement;
  }

  elements.forEach((ele) => {
    // 更新游标
    head += 1;
    // 取消观察
    observerVisible.unobserve(ele);
    observerBeyond.unobserve(ele);

    if (container.contains(ele)) {
      // 删除节点
      container.removeChild(ele);
    }

    console.log('recycle above: ', ele.dataset.index);
  });
}

function recycleBelowNodes(entry: IntersectionObserverEntry): void {
  const element = entry.target as HTMLElement;
  const elements: HTMLElement[] = [];

  let cursor = element.nextSibling as HTMLElement;

  while (cursor) {
    // queue
    elements.unshift(cursor);

    // loop
    cursor = cursor.nextSibling as HTMLElement;
  }

  elements.forEach((ele) => {
    // 更新游标
    tail -= 1;
    // 取消观察
    observerVisible.unobserve(ele);
    observerBeyond.unobserve(ele);

    if (container.contains(ele)) {
      // 删除节点
      container.removeChild(ele);
    }

    console.log('recycle below: ', ele.dataset.index);
  });
}

function replenishTailNodes() {
  // 确认后续存在条目
  if (tail < lastIndex) {
    // 更新数据范围标记
    tail += 1;

    console.log('insert tail: ', tail);

    const element = renderItem(DynamicRecords[tail]);
    // 新节点纳入观察
    observerVisible.observe(element);
    observerBeyond.observe(element);
    // 尾部插入新节点
    container.appendChild(element);
  }
}

function replenishHeadNodes() {
  // 确认后续存在条目
  if (head > 0) {
    // 更新数据范围标记
    head -= 1;

    console.log('insert head ', head);

    const element = renderItem(DynamicRecords[head]);
    // 新节点纳入观察
    observerVisible.observe(element);
    observerBeyond.observe(element);
    // 尾部插入新节点
    container.insertBefore(element, container.firstChild);
  }
}

const observeVisibleCallback: IntersectionObserverCallback = (entries) => {
  // 初始化阶段过滤干扰
  const pristines = entries.filter(
    (entry) => (entry.target as HTMLElement).dataset.visible === 'pending'
  );

  // 排除初始化干扰
  const enters = entries
    .filter(
      (entry) => (entry.target as HTMLElement).dataset.visible === 'ready'
    )
    // 仅关注进入可视区域元素
    .filter((entry) => entry.isIntersecting === true);

  console.group('Insert');

  enters.forEach((entry) => {
    // 从下而上进入缓冲区，尾部补充节点
    if (
      entry.boundingClientRect.top <= entry.rootBounds!.bottom &&
      entry.boundingClientRect.bottom >= entry.rootBounds!.bottom
    ) {
      console.log('BTA');
      replenishTailNodes();
    }
    // 从上而下进入缓冲区，头部补充节点
    else if (
      entry.boundingClientRect.top <= entry.rootBounds!.top &&
      entry.boundingClientRect.bottom >= entry.rootBounds!.top
    ) {
      console.log('ATB');
      replenishHeadNodes();
    } else {
      // 手速太快，不知如何处理，不如介绍单身妹子如何
      console.log('UNKNOWN');
      // 保守估计，双重插入
      replenishHeadNodes();
      replenishTailNodes();
    }
  });
  console.groupEnd();

  pristines.forEach((entry) => {
    (entry.target as HTMLElement).dataset.visible = 'ready';
  });
};

const observeBeyondCallback: IntersectionObserverCallback = (entries) => {
  // 初始化阶段过滤干扰
  const pristines = entries.filter(
    (entry) => (entry.target as HTMLElement).dataset.beyond === 'pending'
  );

  const leaves = entries
    // 排除初始化干扰
    .filter((entry) => (entry.target as HTMLElement).dataset.beyond === 'ready')
    // 仅关注离开元素
    .filter((entry) => entry.isIntersecting === false);

  console.group('Recycle');

  // 离开缓冲区立刻删除
  leaves.forEach((entry) => {
    const direction =
      entry.boundingClientRect.bottom <= entry.rootBounds!.top ? 'BTA' : 'ATB';

    if (direction === 'BTA') {
      recycleAboveNodes(entry);
    } else {
      recycleBelowNodes(entry);
    }
  });

  console.groupEnd();

  pristines.forEach((entry) => {
    (entry.target as HTMLElement).dataset.beyond = 'ready';
  });
};

const MINIMUM_HEIGHT = 100;
const BUFFER_AREA_HEIGHT = 300;

export function bootstrap() {
  // 首次渲染，初始数量无法判定，选用最小高度计算
  const length = Math.ceil(
    (window.innerHeight + BUFFER_AREA_HEIGHT) / MINIMUM_HEIGHT
  );
  // slice 不包含尾标
  const frames = DynamicRecords.slice(0, length + 1);

  // 更新范围标记
  head = 0;
  tail = length;

  frames.forEach((frame) => {
    container.appendChild(renderItem(frame));
  });

  observerVisible = new IntersectionObserver(observeVisibleCallback, {
    root: container,
    threshold: 0,
  });

  observerBeyond = new IntersectionObserver(observeBeyondCallback, {
    root: container,
    rootMargin: `${BUFFER_AREA_HEIGHT}px 0px`,
    threshold: 0,
  });

  const elements = document.querySelectorAll('.alert');

  elements.forEach((element) => {
    observerVisible.observe(element);
    observerBeyond.observe(element);
  });
}
