/**
 * @description - 固定高度长列表
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// internal
import { FixedRecords, renderItem, patchItem } from './constant';

// scope
const buffer = 3;
const height = 100;
const container = document.querySelector('.vl-core') as HTMLElement;
const lastIndex = FixedRecords.length - 1;

// range
let head = 0;
let tail = 0;

const observeCallback: IntersectionObserverCallback = (entries, observer) => {
  // 初始化阶段过滤干扰
  const pristines = entries.filter(
    (entry) => (entry.target as HTMLElement).dataset.status === 'pending'
  );

  const changes = entries
    // 排除初始化干扰
    .filter((entry) => (entry.target as HTMLElement).dataset.status === 'ready')
    // 仅关注元素离开
    .filter((entry) => entry.intersectionRatio === 0);

  changes.forEach((entry) => {
    console.group('Fixed');

    const direction =
      entry.boundingClientRect.bottom < entry.rootBounds!.top ? 'BTA' : 'ATB';

    console.log('direction :>> ', direction);

    // 从下至上离开观察区域
    if (direction === 'BTA') {
      // 确认后续存在条目
      if (tail < lastIndex) {
        // 更新数据范围标记
        head += 1;
        tail += 1;

        // 回收头部节点到尾部
        container.appendChild(
          patchItem(FixedRecords[tail], container.firstChild as HTMLElement)
        );
      }
    }
    // 从上至下离开观察区域
    else {
      if (head > 0) {
        // 更新数据范围标记
        head -= 1;
        tail -= 1;

        // 回收尾部节点到头部
        container.insertBefore(
          patchItem(FixedRecords[head], container.lastChild as HTMLElement),
          container.firstChild
        );
      }
    }

    console.groupEnd();
  });

  pristines.forEach((entry) => {
    (entry.target as HTMLElement).dataset.status = 'ready';
  });
};

export function bootstrap() {
  // 首次渲染，初始数量为可视数量 buffer * 2
  const length = Math.ceil(window.innerHeight / height) + buffer * 2;
  // slice 不包含尾标
  const frames = FixedRecords.slice(0, length + 1);

  // 更新范围标记
  head = 0;
  tail = length;

  frames.forEach((frame) => {
    container.appendChild(renderItem(frame));
  });

  const bufferHeight = buffer * height;
  const options = {
    root: container,
    rootMargin: `${bufferHeight}px 0px`,
    threshold: 0,
  };

  const observer = new IntersectionObserver(observeCallback, options);
  const elements = document.querySelectorAll('.alert');

  elements.forEach((element) => {
    observer.observe(element);
  });
}
