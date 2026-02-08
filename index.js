#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// 基本参数配置
const API_URL = "http://apis.juhe.cn/simpleWeather/query";
const API_KEY = process.env.JUHE_WEATHER_API_KEY || "您的聚合数据API_KEY";

// 创建 MCP 服务器实例
const server = new Server(
  {
    name: "weather-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_weather",
        description: "查询中国城市的实时天气信息",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "城市名称，例如：苏州、北京、上海、深圳等",
            },
          },
          required: ["city"],
        },
      },
      {
        name: "get_weather_details",
        description: "获取城市的详细天气信息，包括未来几天预报",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "城市名称，例如：苏州、北京、上海、深圳等",
            },
          },
          required: ["city"],
        },
      },
    ],
  };
});

// 格式化天气数据
function formatWeatherData(data, city) {
  if (!data || data.error_code !== 0) {
    return {
      success: false,
      message: data?.reason || "查询天气失败",
    };
  }

  const realtime = data.result.realtime;
  const future = data.result.future;

  return {
    success: true,
    city: city,
    current: {
      temperature: realtime.temperature,
      humidity: realtime.humidity,
      info: realtime.info,
      wid: realtime.wid,
      direct: realtime.direct,
      power: realtime.power,
      aqi: realtime.aqi,
    },
    future: future.map((day) => ({
      date: day.date,
      temperature: day.temperature,
      weather: day.weather,
      direct: day.direct,
      wid: day.wid,
    })),
  };
}

// 发起天气查询请求
async function fetchWeather(city) {
  try {
    const requestParams = {
      key: API_KEY,
      city: city,
    };

    const response = await axios.get(API_URL, { params: requestParams });

    if (response.status === 200) {
      const responseResult = response.data;

      if (responseResult.error_code === 0) {
        return formatWeatherData(responseResult, city);
      } else {
        return {
          success: false,
          message: `API错误: ${responseResult.reason || "未知错误"}`,
        };
      }
    } else {
      return {
        success: false,
        message: "请求异常",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `网络请求失败: ${error.message}`,
    };
  }
}

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "query_weather": {
      const result = await fetchWeather(args.city);

      if (result.success) {
        const current = result.current;
        const output = `
🌍 城市：${result.city}
🌡️ 当前温度：${current.temperature}℃
💧 湿度：${current.humidity}%
☁️ 天气状况：${current.info}
🌬️ 风向：${current.direct}
💨 风力：${current.power}
🌫️ 空气质量指数：${current.aqi}
        `.trim();

        return {
          content: [
            {
              type: "text",
              text: output,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `❌ ${result.message}`,
            },
          ],
        };
      }
    }

    case "get_weather_details": {
      const result = await fetchWeather(args.city);

      if (result.success) {
        const current = result.current;
        const future = result.future;

        let output = `
🌍 城市：${result.city}

📍 当前天气
🌡️ 温度：${current.temperature}℃
💧 湿度：${current.humidity}%
☁️ 天气：${current.info}
🌬️ 风向：${current.direct}
💨 风力：${current.power}
🌫️ 空气质量：${current.aqi}

📅 未来天气预报
        `.trim();

        future.forEach((day, index) => {
          output += `
${index + 1}. ${day.date}
   🌡️ ${day.temperature}
   ☁️ ${day.weather}
   🌬️ ${day.direct}
          `;
        });

        return {
          content: [
            {
              type: "text",
              text: output,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `❌ ${result.message}`,
            },
          ],
        };
      }
    }

    default:
      throw new Error(`未知工具: ${name}`);
  }
});

// 启动服务器
async function main() {
  // 检查 API Key
  if (API_KEY === "您的聚合数据API_KEY") {
    console.error("⚠️  警告: 请设置聚合数据 API_KEY!");
    console.error("⚠️  方式1: 设置环境变量 JUHE_WEATHER_API_KEY");
    console.error("⚠️  方式2: 在代码中直接修改 API_KEY 常量");
    console.error("⚠️  获取地址: https://www.juhe.cn/docs/api/id/39");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("天气查询 MCP 服务已启动 (stdio 模式)");
}

main().catch((error) => {
  console.error("服务启动失败:", error);
  process.exit(1);
});
