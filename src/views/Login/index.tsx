import { Button, Form, Image, Input } from 'antd-mobile';
import md5 from 'js-md5';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PIC_SUCCESS from '@/assets/icons/success.png';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import useUserStore from '@/store/useUserStore';
import { LoginConfigs } from '@/utils/config';

import styles from './index.module.less';

enum LOGIN_STATUS {
  LOGIN,
  LOGINED,
  CONFIRMED,
}

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);

  const [status, setStatus] = useState<LOGIN_STATUS>(LOGIN_STATUS.LOGIN);

  useAsyncEffect(async () => {
    const qid = params.get('qid');
    if (qid) {
      // TODO 当前移动端的token是过期状态的怎么处理
      if (user) {
        setStatus(LOGIN_STATUS.LOGINED);
        // TODO 异常处理 -> status设置失败的情况
        await setQrcodeStatus(qid, 'CONFIRMING');
      } else {
        setStatus(LOGIN_STATUS.LOGIN);
      }
    } else {
      setStatus(LOGIN_STATUS.LOGIN);
    }
  }, [params]);

  // 提交登录表单
  const onFinish = async (values: { email: string; pwd: string }) => {
    const { email, pwd } = values;
    const success = await login({
      isLogin: true,
      data: {
        email,
        pwd: md5(pwd),
      },
    });
    if (success) {
      navigate('/', { replace: true });
    }
  };

  // 登录表单
  const renderForm = () => {
    return (
      <div className={styles.login}>
        <h1 className={styles.loginTitle}>登录</h1>
        <Form
          name="form"
          onFinish={onFinish}
          validateMessages={LoginConfigs.validateMessages}
          footer={
            <div>
              <Button block type="submit" color="primary" size="large">
                登录
              </Button>
              <Button block fill="none" onClick={() => navigate('/register')}>
                还没有账号？点击去注册
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
    );
  };

  // 用户头像姓名展示&确认登录
  const renderUserInfo = () => {
    if (!user) return null;
    return (
      <div className={styles.userInfo}>
        <Image
          src={user.avatar}
          width={128}
          height={128}
          fit="cover"
          style={{ borderRadius: 64 }}
        />
        <span className={styles.userName}>{user.name}</span>
        <Button
          block
          className={styles.btn}
          color="primary"
          size="large"
          onClick={onConfirm}
        >
          确认登录
        </Button>
      </div>
    );
  };

  // 登录成功
  const renderConfirmed = () => {
    return (
      <div className={styles.comfirmed}>
        <Image src={PIC_SUCCESS} fit="cover" />
        <span className={styles.info}>登录成功</span>
      </div>
    );
  };

  return (
    <div className={styles.main}>
      {status === LOGIN_STATUS.LOGIN && renderForm()}
      {status === LOGIN_STATUS.LOGINED && renderUserInfo()}
      {status === LOGIN_STATUS.CONFIRMED && renderConfirmed()}
    </div>
  );
};
export default Login;
