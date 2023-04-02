import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useAsyncEffect from '@/hooks/useAsyncEffect';
import useDocStore, { Doc } from '@/store/useDocStore';

/**
 * @description 根据路径查询参数返回对应的渲染数据
 * @returns { 待渲染文档列表，当前文档文件夹名， 刷新文档方法 }
 */
export function useDocList() {
  const params = useParams<{ id: string }>();
  const docs = useDocStore((state) => state.docs);
  const getDocsById = useDocStore((state) => state.getDocsById);
  const getFolderNameById = useDocStore((state) => state.getFolderNameById);
  const fetchAllDocs = useDocStore((state) => state.fetchAllDocs);

  const [docsToRender, setDocsToRender] = useState<Doc[] | undefined>(
    getDocsById(params?.id || '0'),
  );
  const [title, setTitle] = useState<string>('所有文档');

  useAsyncEffect(async () => {
    await fetchAllDocs();
  }, []);

  useEffect(() => {
    setDocsToRender(getDocsById(params?.id || '0'));
    setTitle(getFolderNameById(params?.id || '0'));
  }, [docs, params]);

  console.log('useDocList', docsToRender, title);
  return { docsToRender, title, fetchAllDocs };
}

/**
 * @description 返回最近文档（按时间顺序排列的所有文档）
 * @returns { 待渲染文档，更新文档操作 }
 */
export function useRecentDocs() {
  const docs = useDocStore((state) => state.docs);
  const getDocsByDate = useDocStore((state) => state.getDocsByDate);
  const fetchAllDocs = useDocStore((state) => state.fetchAllDocs);
  const [docsToRender, setDocsToRender] = useState<Doc[] | undefined>(getDocsByDate());

  useEffect(() => {
    setDocsToRender(getDocsByDate());
  }, [docs]);

  return { docsToRender, updateDocs: fetchAllDocs };
}
