import { useRoutes } from 'react-router-dom';

import { routes } from './router';

function App() {
  // throw new Error('Error测试');
  return useRoutes(routes);
}

export default App;
