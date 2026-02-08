# 天气查询 MCP 服务

基于 Node.js 的 MCP (Model Context Protocol) 服务，提供中国城市天气查询功能。

## 功能特性

- **query_weather**: 查询城市实时天气信息
- **get_weather_details**: 获取详细天气信息，包括未来几天预报

## 数据来源

使用 [聚合数据](https://www.juhe.cn/docs/api/id/39) 的免费天气 API。

## 安装

```bash
# 进入项目目录
cd D:\workspace-ai\weather

# 安装依赖
npm install
```

## 配置 API Key

### 方式一：环境变量（推荐）

1. 访问 [聚合数据官网](https://www.juhe.cn/docs/api/id/39) 注册账号
2. 在个人中心获取 API Key
3. 创建 `.env` 文件：

```bash
JUHE_WEATHER_API_KEY=你的API_KEY
```

### 方式二：直接修改代码

编辑 `index.js`，修改 API_KEY 常量：

```javascript
const API_KEY = "你的聚合数据API_KEY";
```

## 调试服务

### 使用 MCP Inspector（推荐）

```bash
npm run inspect
```

这将启动一个本地 Web 界面，你可以：
- 查看所有可用的工具
- 测试工具调用
- 查看请求和响应详情

### 命令行测试

```bash
# 启动服务
npm start
```

## 在 Claude Desktop 中使用

编辑配置文件 `~\.claude\claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["D:\\workspace-ai\\weather\\index.js"],
      "env": {
        "JUHE_WEATHER_API_KEY": "你的API_KEY"
      }
    }
  }
}
```

**注意**：Windows 路径使用双反斜杠 `\\` 或正斜杠 `/`。

## 使用示例

### 查询实时天气

```
帮我查一下苏州今天的天气
```

### 查询详细预报

```
帮我查看北京未来几天的天气预报
```

## 项目结构

```
weather/
├── index.js           # MCP 服务主文件
├── package.json       # 项目配置
├── .env.example       # 环境变量示例
├── .gitignore         # Git 忽略文件
└── README.md          # 项目文档
```

## API 返回数据示例

```json
{
  "error_code": 0,
  "reason": "success",
  "result": {
    "realtime": {
      "temperature": "21",
      "humidity": "32",
      "info": "晴",
      "wid": "00",
      "direct": "东北风",
      "power": "3级",
      "aqi": "71"
    },
    "future": [
      {
        "date": "2024-01-15",
        "temperature": "9/21℃",
        "weather": "晴",
        "wid": "00",
        "direct": "东北风"
      }
    ]
  }
}
```

## 常见问题

### Q1: 提示 "请设置聚合数据 API_KEY"

需要在 `.env` 文件中设置 `JUHE_WEATHER_API_KEY`，或直接在代码中修改 `API_KEY` 常量。

### Q2: 网络请求失败

- 检查网络连接
- 确认 API Key 是否正确
- 检查聚合数据 API 配额是否用完

### Q3: Windows 路径问题

在 Claude Desktop 配置中，路径使用双反斜杠：
```json
"args": ["D:\\workspace-ai\\weather\\index.js"]
```

## 许可证

MIT

## 参考资源

- [MCP 官方文档](https://modelcontextprotocol.info)
- [聚合数据天气 API](https://www.juhe.cn/docs/api/id/39)
