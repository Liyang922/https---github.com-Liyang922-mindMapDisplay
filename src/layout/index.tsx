import { TabBar } from 'antd-mobile';
import { AppOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import useUserStore from '@/store/useUserStore';

import styles from './index.module.less';

export default function Layout() {
  const token = useUserStore((state) => state.token);
  const loc = useLocation();
  const navigate = useNavigate();

  // 登录权限判断
  if (!token) {
    return <Navigate to="/login" />;
  }

  // tab列表
  const tabs = [
    {
      key: '/app',
      title: '文档',
      icon: <UnorderedListOutline fontSize={23} />,
    },
    {
      key: '/app/recent',
      title: '捷径',
      icon: <AppOutline fontSize={23} />,
    },
    {
      key: '/app/user',
      title: '个人',
      icon: <UserOutline fontSize={23} />,
    },
  ];

  const onTabChange = (value: string) => {
    if (value !== loc.pathname) {
      navigate(value);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.footer}>
        {
          <TabBar activeKey={loc.pathname} onChange={onTabChange} className={styles.tab}>
            {tabs.map((item) => (
              <TabBar.Item
                key={item.key}
                icon={item.icon}
                title={item.title}
                className={styles.tabItem}
              />
            ))}
          </TabBar>
        }
      </div>
      <Outlet />
    </div>
  );
}
