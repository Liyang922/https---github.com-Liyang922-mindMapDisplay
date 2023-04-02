import './index.module.less';

import { memo } from 'react'; // props相同时渲染相同，记忆渲染结果提高性能

type SvgIcon = {
  name: string;
  className?: string;
};

const SvgIcon = ({ name, className }: SvgIcon) => {
  // icon的Symbol引入
  return (
    <svg aria-hidden="true" className={`svg-icon ${className}`}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
};

export default memo(SvgIcon);
