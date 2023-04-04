import { Button, Modal, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import useInput from '@/hooks/useInput';
import useUserStore from '@/store/useUserStore';

import styles from './index.module.less';

function User() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const { localUrl, type, handlePost, InputElement } = useInput();

  function onClickLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // 点击切换头像，显示Modal
  function onClickChooseimg() {
    Modal.confirm({
      title: '选择新头像',
      content: (
        // <input type="file" name="image" accept="image/*" onChange={handleInputChange} />
        <InputElement />
      ),
      showCloseButton: true,
      onConfirm: async () => {
        const res = await handlePost(localUrl, type);
        const message = res ? 'success' : 'fail';
        Toast.show({
          icon: message,
          content: '提交成功',
          position: 'bottom',
        });
      },
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <img src={user?.avatar} alt={user?.name} />
        <h2>{user?.name}</h2>
        <div>
          <Button color="primary" onClick={onClickLogout}>
            退出登录
          </Button>
          <Button color="primary" onClick={onClickChooseimg}>
            更改头像
          </Button>
        </div>
      </div>
    </div>
  );
}

export default User;
