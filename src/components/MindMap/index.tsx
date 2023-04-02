import React, { ReactComponentElement, useCallback, useRef } from 'react';
import MindMap from 'simple-mind-map';

// import { Drag } from 'simple-mind-map';
// import Drag from 'simple-mind-map/Drag.js';
import useMapStore from '@/store/useMapStore';

import styles from './index.module.less';

// 根据mapStore里的map数据，借助simple-mind-map进行渲染
const MindMapComponent: React.FC = () => {
  // console.log(MindMapItem);
  // console.log('mindmap > render');
  const definition = useMapStore((state) => state.definition);

  const mapRef = useCallback((node) => {
    if (node !== null) {
      const mindMapItem = new MindMap({
        el: node,
        data: definition?.root,
      });
      mindMapItem.render();
      mindMapItem.resize();
    }
  }, []);

  return (
    <div>
      <div className={styles.mapContainer} ref={mapRef}></div>
    </div>
  );
};

export default MindMapComponent;
