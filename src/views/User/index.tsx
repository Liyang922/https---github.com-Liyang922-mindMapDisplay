import { Button, Modal, Toast } from 'antd-mobile';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useInput from '@/hooks/useInput';
import useUserStore from '@/store/useUserStore';

import styles from './index.module.less';

function User() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();

  // const { imgRef, localUrl, type, handlePost } = useInput(file);
  // // eslint-disable-next-line no-debugger
  // debugger;
  const { imgRef, handlePost } = useInput(file);

  function onClickLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // 图片最大size为1MB
  // const imgMaxSize = 1024 * 1024;
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 得到file对象
    const files = event.target.files;
    if (files && files?.length) {
      // setFile(files[0]);
      const file = files[0];
      // const quality = file.size > imgMaxSize ? 0.2 : 1;
      setFile(file);
      // fileToBase64(files[0], quality);
    }
  };

  // 点击切换头像，显示Modal
  function onClickChooseimg() {
    Modal.confirm({
      title: '选择新头像',
      content: (
        // // <input type="file" name="image" accept="image/*" onChange={handleInputChange} />
        // <InputElement />
        <div>
          <input type="file" name="image" accept="image/*" onChange={handleInputChange} />
          <img src="" alt="" ref={imgRef}></img>
        </div>
      ),
      showCloseButton: true,
      onConfirm: async () => {
        const res = await handlePost();
        const message = res ? 'success' : 'fail';
        const content = res ? '提交成功' : '提交失败';
        Toast.show({
          icon: message,
          content: content,
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
