import { SafeArea } from 'antd-mobile';
import { memo } from 'react';

import SvgIcon from '@/components/SvgIcon';

import styles from './index.module.less';

export interface HeaderAction {
  icon: string;
  clickFc: () => void;
}

export interface Header {
  title: string;
  leftActions?: Array<HeaderAction>;
  rightActions?: Array<HeaderAction>;
}

function PageHeader({ title, leftActions, rightActions }: Header) {
  const renderAction = (actions: HeaderAction[] | undefined) => {
    if (!actions || !actions.length) return;
    return actions.map((action) => (
      <div
        aria-hidden="true"
        className={styles.icon}
        key={action.icon}
        onClick={action.clickFc}
      >
        <SvgIcon name={action.icon} />
      </div>
    ));
  };

  return (
    <div className={styles.header}>
      <SafeArea position="top" />
      <div className={styles.headerContent}>
        {renderAction(leftActions)}
        <h1>{title}</h1>
        {renderAction(rightActions)}
      </div>
    </div>
  );
}

// props相同时返回不重新渲染
export default memo(PageHeader);
