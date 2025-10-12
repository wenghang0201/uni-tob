// 显示Toast消息
NativeBridge.showToast("消息内容");

// 在浏览器中打开链接
NativeBridge.openWithBrowser("https://example.com");

// 获取设备信息
var deviceInfo = NativeBridge.getDeviceInfo();

// 播放音乐
NativeBridge.playMusic("https://example.com/music.mp3");

// 停止音乐
NativeBridge.stopMusic();

// 获取设备ID
var deviceId = NativeBridge.getDeviceId();