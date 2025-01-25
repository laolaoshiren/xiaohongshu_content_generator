# 小红书文案生成器 🌟

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=laolaoshiren.xiaohongshu_content_generator)
![GitHub stars](https://img.shields.io/github/stars/laolaoshiren/xiaohongshu_content_generator?style=social)
![GitHub forks](https://img.shields.io/github/forks/laolaoshiren/xiaohongshu_content_generator?style=social)
![GitHub issues](https://img.shields.io/github/issues/laolaoshiren/xiaohongshu_content_generator)
![GitHub license](https://img.shields.io/github/license/laolaoshiren/xiaohongshu_content_generator)

一个基于本地 Ollama 模型的小红书风格文案生成工具。可以根据关键词自动生成吸引人的标题和内容，支持多种写作风格，并自动添加合适的表情符号和话题标签。

## 功能特点 ✨

- 🤖 支持所有本地安装的 Ollama 模型
- 📝 自动生成吸引人的标题和内容
- 😊 智能添加表情符号
- #️⃣ 自动生成话题标签
- 👤 AI 生成符合主题的作者昵称
- 💾 支持 TXT 和 JSON 两种输出格式
- 🎨 多种文章风格随机切换
- 📂 自动管理文件序号，避免覆盖

## 安装要求

- Node.js (建议 v12.0.0 或更高版本)
- Ollama (需要预先安装并运行)
- 至少一个已下载的 Ollama 模型

## 安装步骤

1. 克隆项目到本地：
```bash
git clone https://github.com/laolaoshiren/xiaohongshu_content_generator.git
cd xiaohongshu_content_generator
```

2. 安装依赖：
```bash
npm install
```

3. 确保 Ollama 服务正在运行：
```bash
ollama serve
```

## 使用方法

1. 运行程序：
```bash
node index.js
```

2. 按提示操作：
   - 选择要使用的 AI 模型
   - 输入文案关键词
   - 输入需要生成的文案数量
   - 选择输出格式（TXT/JSON）

3. 生成的文案将保存在 `generated_articles` 目录下

## 输出格式

### TXT 格式
```
✨🌸💫 标题 💫🌸✨

第一段内容 🎀💝

第二段内容 💕✨

第三段内容 🌟🦋

#小红书干货 #经验分享 #达人分享

💝 觉得有帮助的话，记得点点关注，点点赞哦~
```

### JSON 格式
```json
{
  "title": "文章标题",
  "content": "文章正文内容...",
  "createTime": "2024-01-01T12:34:56.789Z",
  "author": "AI生成的作者昵称",
  "keywords": ["主关键词", "相关关键词1", "相关关键词2"],
  "summary": "文章简介",
  "model": "使用的模型名称"
}
```

## 文章风格

- 温暖治愈风
- 元气少女风
- 知性成熟风
- 清新文艺风
- 励志正能量风
- 搞笑幽默风
- 感性抒情风

## 注意事项

1. 使用前请确保：
   - Ollama 服务正在运行
   - 已安装至少一个 AI 模型
   - Node.js 环境正确配置

2. 生成的文案仅供参考，建议：
   - 检查内容的准确性和适当性
   - 根据实际需要进行修改和调整
   - 遵守平台的内容规范

## 常见问题

1. 如果无法获取模型列表，请检查：
   - Ollama 服务是否正在运行
   - 是否已安装模型
   - 网络连接是否正常

2. 如果生成的文案格式异常：
   - 检查系统编码设置
   - 确保终端支持 UTF-8
   - 尝试重新运行程序

## 贡献指南

欢迎提交 Pull Request 或 Issue！

1. Fork 本仓库
2. 创建你的特性分支：`git checkout -b feature/AmazingFeature`
3. 提交你的改动：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=laolaoshiren/xiaohongshu_content_generator&type=Date)](https://star-history.com/#laolaoshiren/xiaohongshu_content_generator&Date)

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情 