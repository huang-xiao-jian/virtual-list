import { FixedRecords } from '../fixed/constant';
import { lorem } from 'faker';
import { renderItem } from '../renderer';

const detect = (entry: IntersectionObserverEntry) => {
  if (
    entry.boundingClientRect.top <= entry.rootBounds!.bottom &&
    entry.boundingClientRect.bottom >= entry.rootBounds!.bottom
  ) {
    console.log('BTA');
  }
  // 从上而下进入缓冲区，头部补充节点
  else if (
    entry.boundingClientRect.top <= entry.rootBounds!.top &&
    entry.boundingClientRect.bottom >= entry.rootBounds!.top
  ) {
    console.log('ATB');
  } else {
    console.log('UNKNOWN');
    console.log(entry);
  }
};

const observeCallback: IntersectionObserverCallback = (entries, observer) => {
  // 初始化阶段过滤干扰
  const pristines = entries.filter(
    (entry) => (entry.target as HTMLElement).dataset.status === 'pending'
  );

  const changes = entries
    // 排除初始化干扰
    .filter((entry) => (entry.target as HTMLElement).dataset.status === 'ready')
    // 仅关注元素进入
    .filter((entry) => entry.isIntersecting);

  changes.forEach((entry) => {
    console.log(entry.target.dataset);
    // detect(entry);
  });

  pristines.forEach((entry) => {
    (entry.target as HTMLElement).dataset.status = 'ready';
  });
};

export function bootstrap() {
  const container = document.querySelector('.vl-core') as HTMLElement;
  // 首次渲染，初始数量无法判定，选用最小高度计算
  // slice 不包含尾标
  const frames = FixedRecords.slice(0, 500);

  frames.forEach((frame) => {
    container.appendChild(renderItem(frame));
  });

  const options = {
    root: container,
    rootMargin: `0px`,
    threshold: 0,
  };

  const observer = new IntersectionObserver(observeCallback, options);
  const elements = document.querySelectorAll('.alert');

  elements.forEach((element) => {
    observer.observe(element);
  });
}

function renderItem1() {
  const ele = document.createElement('div');

  ele.setAttribute('class', 'alert alert-primary');

  // 原始数据控制长度，保证容器高度固定
  ele.textContent = lorem.sentence(35).slice(0, 125);

  const container = document.querySelector('.vl-core') as HTMLElement;

  container.insertBefore(ele, container.firstChild);

  return ele;
}

window.renderItem = renderItem1;
