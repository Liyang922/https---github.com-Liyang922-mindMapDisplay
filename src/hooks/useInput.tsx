import { useCallback, useEffect, useRef, useState } from 'react';

const useInput = (file: File | undefined) => {
  const [localUrl, setLocalUrl] = useState<string>('');
  const [type, setType] = useState<string>('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  // const user = useUserStore((state) => state.user);
  // const uploadImg = useUserStore((state) => state.uploadImg);

  // 图片最大size为1MB
  const imgMaxSize = 1024 * 1024;

  useEffect(() => {
    if (file) {
      const quality = file.size > imgMaxSize ? 0.2 : 1;
      fileToBase64(file, quality);
    }
  }, [file]);

  useEffect(() => {
    if (imgRef.current) {
      console.log('localUrl update');
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

  return {
    imgRef,
    localUrl,
    type,
  };
};

export default useInput;
