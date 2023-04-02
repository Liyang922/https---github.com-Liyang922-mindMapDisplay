import { PullToRefresh } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import DocItem from '@/components/DocListItem';
import { FullPageEmpty } from '@/components/FullPageFallback';
import PageHeader, { HeaderAction } from '@/components/Headers';
import { useDocList } from '@/hooks/useDocs';
import useMapStore from '@/store/useMapStore';

import styles from './index.module.less';

export default function Home() {
  const params = useParams<{ id: string }>();
  const { docsToRender, title, fetchAllDocs } = useDocList();
  const [leftActions, setLeftActions] = useState<HeaderAction[]>([]);
  // useRef创建的ref对象是一个通用容器，每次渲染时返回同一个ref对象，不会触发PageHeader组件的渲染
  const rightActions = useRef<HeaderAction[]>([{ icon: 'more', clickFc: onMoreAction }]);

  console.log('docsToRender', docsToRender);

  useEffect(() => {
    // '/app: id'
    if (params?.id) {
      setLeftActions([{ icon: 'arrow-left', clickFc: () => history.go(-1) }]);
    } else {
      // '/app'
      setLeftActions([]);
    }
  }, [params]);

  function onMoreAction() {
    console.log('more action');
  }

  function renderDocs() {
    if (!docsToRender || !docsToRender.length) return <FullPageEmpty />;
    return docsToRender.map((doc) => <DocItem key={doc.id} doc={doc} />);
  }

  return (
    <div className={styles.main}>
      <PageHeader
        title={title}
        rightActions={rightActions.current}
        leftActions={leftActions}
      />
      <PullToRefresh onRefresh={fetchAllDocs}>
        <div className={styles.listContainer}>{renderDocs()}</div>
      </PullToRefresh>
    </div>
  );
}
