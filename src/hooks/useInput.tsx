import { useCallback, useEffect, useRef, useState } from 'react';

// import { v4 as uuidv4 } from 'uuid';
import useUserStore from '@/store/useUserStore';

const useInput = () => {
  const [localUrl, setLocalUrl] = useState<string>('');
  const [type, setType] = useState<string>('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const user = useUserStore((state) => state.user);
  const uploadImg = useUserStore((state) => state.uploadImg);

  // 图片最大size为1MB
  const imgMaxSize = 1024 * 1024;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 得到file对象
    const files = event.target.files;
    if (files && files?.length) {
      // setFile(files[0]);
      const file = files[0];
      const quality = file.size > imgMaxSize ? 0.2 : 1;
      fileToBase64(files[0], quality);
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      console.log('localUrl update', localUrl);
      imgRef.current.src = localUrl;
    }
  }, [localUrl]);

  const fileToBase64 = (file: File, quality: number) => {
    const type = file.type;
    setType(type);
    const reader = new FileReader();

    // fileReader异步
    reader.onload = () => {
      console.log('fileReader loaded');
      compress(reader.result as string, quality, type);
      // setLocalUrl(imgUrl);
    };

    console.log('压缩前图像大小', file.size / 1024 / 1024, 'M');
    reader.readAsDataURL(file);
  };

  const compress = (imgUrl: string, quality: number, type: string): void => {
    const img = document.createElement('img');
    img.src = imgUrl;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedUrl = canvas.toDataURL(type, quality);
      setLocalUrl(compressedUrl);
    };
  };

  const handlePost = useCallback(
    async (localUrl: string, type: string) => {
      // dataURL——解析——得到二进制
      console.log('handlePost-localUrl', localUrl);
      const bytes = window.atob(localUrl).split(',')[1]; // 解码base64
      console.log('handlePost-bytes', bytes);
      const arrayBuffer = new ArrayBuffer(bytes.length);
      const unit8Array = new Uint8Array(arrayBuffer); // 8位无符号整数，0-255
      for (let i = 0; i < bytes.length; i++) {
        unit8Array[i] = bytes.charCodeAt(i); // 转为二进制
      }
      const blob = new Blob([unit8Array], { type: type });
      // 利用FormData进行上传
      const fileName = user?._id + '.' + type.split('/');
      const formData = new FormData();
      formData.append('type', type);
      formData.append('size', String(blob.size));
      formData.append('name', fileName);
      // formData.append() userName
      formData.append('file', blob);
      const res = await uploadImg(formData);
      return res;
    },
    [type, localUrl],
  );

  const InputElement = () => {
    return (
      <div>
        <input type="file" name="image" accept="image/*" onChange={handleInputChange} />
        <img src="" alt="" ref={imgRef}></img>
      </div>
    );
  };

  return {
    localUrl,
    type,
    handlePost,
    InputElement,
  };
};

export default useInput;
