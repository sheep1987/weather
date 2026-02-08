# 天气查询 MCP 服务

基于 Node.js 的 MCP (Model Context Protocol) 服务，提供中国城市天气查询功能。

## 功能特性

- **query_weather**: 查询城市实时天气信息
- **get_weather_details**: 获取详细天气信息，包括未来几天预报

## 快速安装

### 方式一：使用 npx（推荐）

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "juweather-mcp-server"],
      "env": {
        "JUHE_WEATHER_API_KEY": "你的API_KEY"
      }
    }
  }
}
```

### 方式二：从 GitHub 安装

```bash
# 克隆仓库
git clone https://github.com/jaron2026/weather.git
cd weather

# 安装依赖
npm install
```

然后在 Claude Desktop/Cursor 配置：

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["你的本地路径/index.js"],
      "env": {
        "JUHE_WEATHER_API_KEY": "你的API_KEY"
      }
    }
  }
}
```

## 配置 API Key

1. 访问 [聚合数据官网](https://www.juhe.cn/docs/api/id/39) 注册账号
2. 在个人中心获取 API Key（免费）
3. 将 API Key 填入配置文件的 `JUHE_WEATHER_API_KEY`

## 使用示例

```
帮我查一下苏州今天的天气
北京未来几天的天气预报
深圳现在温度多少
```

## 数据来源

使用 [聚合数据](https://www.juhe.cn/docs/api/id/39) 的免费天气 API。

## 开发

```bash
# 克隆项目
git clone https://github.com/jaron2026/weather.git
cd weather

# 安装依赖
npm install

# 调试
npm run inspect
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

## 许可证

MIT
