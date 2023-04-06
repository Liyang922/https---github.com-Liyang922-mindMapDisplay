interface FileInfo {
  url?: string;
  type?: string;
}

const compress = async (file: File | undefined): Promise<FileInfo> => {
  // 图片最大size为1MB
  const imgMaxSize = 1024 * 1024;
  let res = {};
  if (file) {
    const quality = file.size > imgMaxSize ? 0.2 : 1;
    res = await fileToBase64(file, quality);
  }
  return new Promise((resolve) => resolve(res));
};

const fileToBase64 = (file: File, quality: number): Promise<FileInfo> => {
  const type = file.type;
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    // fileReader异步
    reader.onload = async () => {
      console.log('fileReader loaded');
      const url = await compressImg(reader.result as string, quality, type);
      resolve({ url, type });
    };

    console.log('压缩前图像大小', file.size / 1024 / 1024, 'M');
    reader.readAsDataURL(file);
  });
};

const compressImg = (imgUrl: string, quality: number, type: string): Promise<string> => {
  const img = document.createElement('img');
  img.src = imgUrl;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedUrl = canvas.toDataURL(type, quality);
      resolve(compressedUrl);
    };
  });
};

export default compress;
