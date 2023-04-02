import { Button, Form, Input } from 'antd-mobile';
import md5 from 'js-md5';
import { useNavigate } from 'react-router-dom';

import useUserStore from '@/store/useUserStore';
import { LoginConfigs } from '@/utils/config';

import styles from './index.module.less';

export default function Register() {
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  // 提交登录表单
  const onFinish = async (values: { email: string; pwd: string }) => {
    const { email, pwd } = values;
    const success = await login({
      isLogin: false,
      data: {
        email,
        pwd: md5(pwd),
      },
    });
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.login}>
        <h1 className={styles.loginTitle}>注册</h1>
        <Form
          name="form"
          onFinish={onFinish}
          validateMessages={LoginConfigs.validateMessages}
          footer={
            <div>
              <Button block type="submit" color="primary" size="large">
                注册
              </Button>
              <Button block fill="none" onClick={() => navigate('/login')}>
                返回登录
              </Button>
            </div>
          }
        >
          <Form.Item
            className={styles.formItem}
            name="email"
            label="邮箱"
            rules={LoginConfigs.rules.email}
          >
            <Input
              className={styles.input}
              placeholder="请输入邮箱"
              clearable
              type="email"
            />
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            name="pwd"
            label="密码"
            rules={LoginConfigs.rules.pwd}
          >
            <Input
              className={styles.input}
              placeholder="请输入密码"
              clearable
              type="password"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
