import { Button, Modal, Toast } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useUserStore from '@/store/useUserStore';
import compress from '@/utils/compress';

import styles from './index.module.less';

function User() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const uploadImg = useUserStore((state) => state.uploadImg);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const localUrlRef = useRef('');
  const typeRef = useRef('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log('user changed', user);
    // 设置当前头像显示
    if (avatarRef.current && user?.avatar)
      avatarRef.current.src = user?.avatar + '?' + new Date().getTime();
  }, [user]);

  function onClickLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // 得到file对象
    const files = event.target.files;
    if (files && files?.length) {
      const file = files[0];
      const { url, type } = await compress(file);
      if (imgRef.current && url) {
        imgRef.current.src = url;
      }
      if (url) localUrlRef.current = url;
      if (type) typeRef.current = type;
    }
  };

  const handlePost = async () => {
    // dataURL——解析——得到二进制
    console.log('handlePost-localUrlRef.current', localUrlRef.current);
    const bytes = window.atob(localUrlRef.current.split(',')[1]); // 解码base64
    console.log('handlePost-bytes', bytes);
    const arrayBuffer = new ArrayBuffer(bytes.length);
    const unit8Array = new Uint8Array(arrayBuffer); // 8位无符号整数，0-255
    for (let i = 0; i < bytes.length; i++) {
      unit8Array[i] = bytes.charCodeAt(i); // 转为二进制
    }
    const blob = new Blob([unit8Array], { type: typeRef.current });
    console.log('压缩后图像大小', blob.size / 1024 / 1024, 'M');
    // 利用FormData进行上传
    const fileName = user?._id + '.' + typeRef.current.split('/')[1];
    const formData = new FormData();
    formData.append('file', blob, fileName);
    const res = await uploadImg(formData);
    return res;
  };

  // 点击切换头像，显示Modal
  function onClickChooseimg() {
    Modal.confirm({
      title: '选择新头像',
      content: (
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
        <img src={user?.avatar} alt={user?.name} ref={avatarRef} />
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
