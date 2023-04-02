import { PullToRefresh } from 'antd-mobile';

import DocItem from '@/components/DocListItem';
import { FullPageEmpty } from '@/components/FullPageFallback';
import PageHeader from '@/components/Headers';
import { useRecentDocs } from '@/hooks/useDocs';

import styles from './index.module.less';

export default function Recent() {
  const { docsToRender, updateDocs } = useRecentDocs();

  function renderDocs() {
    if (!docsToRender || !docsToRender.length) return <FullPageEmpty />;
    return docsToRender.map((doc) => <DocItem key={doc.id} doc={doc} />);
  }
  return (
    <div className={styles.main}>
      <PageHeader title="最近编辑" />
      <PullToRefresh onRefresh={updateDocs}>
        <div className={styles.listContainer}>{renderDocs()}</div>
      </PullToRefresh>
    </div>
  );
}
