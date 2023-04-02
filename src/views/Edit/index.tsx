import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import PageHeader, { HeaderAction } from '@/components/Headers';
import MindMap from '@/components/MindMap';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import useMapStore from '@/store/useMapStore';

import styles from './index.module.less';

enum PAGE_STATUS {
  LOADING,
  ERROR,
  NORMAL,
}

function Edit() {
  const params = useParams<{ id: string }>();
  const map = useMapStore((state) => state.map);
  const fetchMap = useMapStore((state) => state.fetchMap);

  const [pageStatus, setPageStatus] = useState<PAGE_STATUS>(PAGE_STATUS.LOADING);

  const leftActions: HeaderAction[] = [
    { icon: 'hamberger', clickFc: () => console.log('hamber') },
    { icon: 'arrow-left', clickFc: () => history.go(-1) },
  ];
  const rightActions: HeaderAction[] = [
    { icon: 'tree', clickFc: () => console.log('note click') },
    { icon: 'more', clickFc: () => console.log('more click') },
  ];

  // fetchMap
  useAsyncEffect(async () => {
    if (params.id) {
      await fetchMap(params.id);
      setPageStatus(PAGE_STATUS.NORMAL);
    } else {
      setPageStatus(PAGE_STATUS.ERROR);
    }
  }, [params]);

  return (
    <div className={styles.main}>
      <PageHeader
        title={map?.name || '编辑文档'}
        leftActions={leftActions}
        rightActions={rightActions}
      />
      <div id="container">{renderContent()}</div>
    </div>
  );
  function renderContent() {
    if (pageStatus === PAGE_STATUS.ERROR) {
      return <div>出错啦。。。</div>;
    }
    if (pageStatus === PAGE_STATUS.LOADING) {
      return <div>Loading...</div>;
    }
    return <MindMap />;
  }
}
export default Edit;
