/**
 * 图片压缩工具类
 * @param {string} tempFilePath - 图片路径
 * @param {object} options - 压缩选项
 * @returns {Promise<string>} - 返回压缩后的base64图片数据
 */
export const compressImage = (tempFilePath, options = {}) => {
    const {
        maxSize = 200, // 最大文件大小（KB）
        maxWidth = 800, // 最大宽度
        maxHeight = 800, // 最大高度
        quality = 0.7 // 压缩质量
    } = options;
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = tempFilePath;
        img.onload = () => {
            // 创建canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // 计算压缩后的尺寸
            let width = img.width;
            let height = img.height;
            if (width > height && width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            } else if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }
            // 设置canvas尺寸
            canvas.width = width;
            canvas.height = height;
            // 绘制图片
            ctx.drawImage(img, 0, 0, width, height);
            // 转换为base64并压缩
            const base64 = canvas.toDataURL('image/jpeg', quality);
            // 转换base64为Blob以检查大小
            const arr = base64.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const compressedBlob = new Blob([u8arr], { type: mime });
            // 检查文件大小
            if (compressedBlob.size / 1024 <= maxSize) {
                resolve(base64);
            } else {
                // 如果还是太大，递归压缩
                compressImage(base64, {
                    ...options,
                    quality: quality * 0.8
                }).then(resolve).catch(reject);
            }
        };
        img.onerror = reject;
    });
};