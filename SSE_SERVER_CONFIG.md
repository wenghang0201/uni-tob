# SSE服务端配置说明

## 问题描述

当前遇到错误：`EventSource's response has a MIME type ("application/json") that is not "text/event-stream". Aborting the connection.`

这是因为EventSource要求服务器返回的Content-Type必须是`text/event-stream`，但服务器返回的是`application/json`。

## 解决方案

### 方案1：修改服务端MIME类型（推荐）

在服务端的`/sse/connect`端点中，确保返回正确的Content-Type：

```javascript
// Node.js Express示例
app.get('/sse/connect', (req, res) => {
  // 设置正确的Content-Type
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 发送SSE格式的数据
  res.write('data: {"type":"connected","message":"连接成功"}\n\n');
  
  // 定期发送心跳
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat","timestamp":' + Date.now() + '}\n\n');
  }, 30000);
  
  // 客户端断开连接时清理
  req.on('close', () => {
    clearInterval(heartbeat);
  });
});
```

```java
// Java Spring Boot示例
@GetMapping(value = "/sse/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter connect() {
    SseEmitter emitter = new SseEmitter();
    
    // 发送连接成功消息
    try {
        emitter.send(SseEmitter.event()
            .name("connected")
            .data("{\"type\":\"connected\",\"message\":\"连接成功\"}"));
    } catch (IOException e) {
        emitter.completeWithError(e);
    }
    
    return emitter;
}
```

```python
# Python Flask示例
from flask import Response, stream_with_context
import json

@app.route('/sse/connect')
def sse_connect():
    def generate():
        yield f"data: {json.dumps({'type': 'connected', 'message': '连接成功'})}\n\n"
        
        # 定期发送心跳
        while True:
            yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': time.time()})}\n\n"
            time.sleep(30)
    
    return Response(stream_with_context(generate()), 
                   mimetype='text/event-stream',
                   headers={'Cache-Control': 'no-cache',
                           'Connection': 'keep-alive'})
```

### 方案2：使用轮询模式（已实现）

如果无法修改服务端配置，客户端会自动切换到轮询模式：

- 每5秒向`/sse/connect`发送GET请求
- 服务端返回JSON格式的消息
- 客户端处理消息并触发相应事件

### 方案3：使用WebSocket（备选）

如果SSE和轮询都不适合，可以考虑使用WebSocket：

```javascript
// 客户端WebSocket连接
const ws = new WebSocket('ws://your-server/ws/connect');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // 处理消息
};
```

## 服务端消息格式

### SSE格式
```
data: {"type":"order_update","orderId":"123","orderData":{"status":"processing"}}

data: {"type":"new_order","orderData":{"id":"456","amount":100}}

data: {"type":"notification","message":"系统维护通知"}

data: {"type":"system_alert","message":"重要系统更新"}
```

### 轮询格式（JSON响应）
```json
{
  "success": true,
  "data": [
    {
      "type": "order_update",
      "orderId": "123",
      "orderData": {"status": "processing"}
    },
    {
      "type": "new_order", 
      "orderData": {"id": "456", "amount": 100}
    }
  ]
}
```

## 客户端自动切换逻辑

1. **优先尝试SSE连接**
2. **如果SSE失败（MIME类型错误、连接超时等），自动切换到轮询**
3. **轮询模式每5秒请求一次**
4. **两种模式都支持相同的消息类型和事件**

## 测试建议

1. 先测试服务端是否正确返回`text/event-stream`类型
2. 使用浏览器开发者工具查看网络请求的Content-Type
3. 如果SSE不工作，客户端会自动切换到轮询模式
4. 检查控制台日志确认连接状态

## 注意事项

- SSE连接需要保持长连接，服务端不能过早关闭连接
- 建议实现心跳机制保持连接活跃
- 考虑添加重连机制处理网络中断
- 在生产环境中建议使用HTTPS/WSS 