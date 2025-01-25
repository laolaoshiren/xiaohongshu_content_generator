const readlineSync = require('readline-sync');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 设置命令行编码
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');

// 表情符号数组
const emojis = ['🥰', '💖', '✨', '🌈', '💫', '🌸', '🎀', '💝', '🍓', '🌟', '💕', '🦋', '🌺', '🎈'];

// 文章风格数组
const styles = [
    '温暖治愈风',
    '元气少女风',
    '知性成熟风',
    '清新文艺风',
    '励志正能量风',
    '搞笑幽默风',
    '感性抒情风'
];

// 随机获取数组中的元素
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 确保输出目录存在
const outputDir = path.join(__dirname, 'generated_articles');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 获取本地可用的模型列表
async function getAvailableModels() {
    try {
        const response = await axios.get('http://localhost:11434/api/tags');
        return response.data.models.map(model => model.name);
    } catch (error) {
        console.error('获取模型列表失败:', error.message);
        return [];
    }
}

// 让用户选择模型
async function selectModel() {
    const models = await getAvailableModels();
    if (models.length === 0) {
        console.log('\x1b[31m错误: 未能获取到本地模型列表，请确保Ollama服务正在运行。\x1b[0m');
        process.exit(1);
    }

    console.log('\n\x1b[36m可用的模型列表：\x1b[0m');
    models.forEach((model, index) => {
        console.log(`\x1b[33m${index + 1}. ${model}\x1b[0m`);
    });

    const modelIndex = readlineSync.questionInt('\n\x1b[36m请选择要使用的模型 (输入序号): \x1b[0m', {
        limit: input => {
            const num = parseInt(input);
            return num >= 1 && num <= models.length;
        },
        limitMessage: '\x1b[31m请输入有效的模型序号\x1b[0m'
    });

    return models[modelIndex - 1];
}

// 清理AI返回的文本，去除<think>标签及其内容
function cleanAIResponse(text) {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '')
               .replace(/<think>[\s\S]*/g, '')
               .trim();
}

// 格式化文章内容
function formatArticle(content) {
    // 分离标题和正文
    let lines = content.split('\n').filter(line => line.trim());
    let title = lines[0];
    let body = lines.slice(1);

    // 处理标题
    title = title.replace(/[【】]/g, '').trim();
    const titleEmojis = Array(3).fill().map(() => getRandomElement(emojis)).join('');
    title = `${titleEmojis} ${title} ${titleEmojis}`;

    // 处理正文
    body = body.map(paragraph => {
        if (paragraph.trim()) {
            // 每段末尾添加2个随机表情
            const paraEmojis = Array(2).fill().map(() => getRandomElement(emojis)).join('');
            return paragraph.trim() + ' ' + paraEmojis;
        }
        return '';
    }).filter(para => para);

    // 添加话题标签
    const hashtags = [
        '#小红书干货',
        '#经验分享',
        '#好物推荐',
        '#生活记录',
        '#达人分享'
    ];
    const selectedHashtags = Array(3)
        .fill()
        .map(() => hashtags[Math.floor(Math.random() * hashtags.length)]);

    // 组合文章
    return [
        title,
        '',  // 标题后空行
        ...body,
        '',  // 正文后空行
        selectedHashtags.join(' '),
        '',
        '💝 觉得有帮助的话，记得点点关注，点点赞哦~'
    ].join('\n');
}

// 生成随机关键词
function getRandomKeywords() {
    const keywordPool = [
        "生活方式", "经验分享", "干货分享", "达人推荐", 
        "实用技巧", "心得体会", "好物推荐", "必看攻略",
        "玩法技巧", "深度体验", "个人成长", "效率提升"
    ];
    
    // 随机选择3个关键词
    return Array(3).fill()
        .map(() => keywordPool[Math.floor(Math.random() * keywordPool.length)])
        .filter((v, i, a) => a.indexOf(v) === i); // 去重
}

// 获取AI生成的作者名字
async function getAIAuthorName(keyword, style, model) {
    const prompt = `请为一个小红书博主创作一个独特的昵称。要求：
    1. 要基于"${keyword}"主题和${style}的写作风格
    2. 昵称要有创意，吸引人，符合小红书调性
    3. 长度在2-6个字之间
    4. 不要使用emoji表情
    请直接返回昵称，不要有任何解释。`;

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: model,
            prompt: prompt,
            stream: false
        });
        return cleanAIResponse(response.data.response);
    } catch (error) {
        console.error('生成作者名字时出错:', error.message);
        return '匿名作者';
    }
}

// 格式化为JSON格式
async function formatArticleToJSON(content, keyword, style, model) {
    // 分离标题和正文
    let lines = content.split('\n').filter(line => line.trim());
    let title = lines[0].replace(/[【】]/g, '').trim();
    let body = lines.slice(1);

    // 生成简述（取第一段，限制在100字以内）
    let summary = body[0].length > 100 ? body[0].slice(0, 97) + '...' : body[0];

    // 获取AI生成的作者名字
    const author = await getAIAuthorName(keyword, style, model);

    // 创建JSON对象
    const articleJSON = {
        title: title,
        content: body.join('\n'),
        createTime: new Date().toISOString(),
        author: author,
        keywords: [keyword, ...getRandomKeywords()],
        summary: summary,
        model: model  // 添加使用的模型信息
    };

    return JSON.stringify(articleJSON, null, 2);
}

async function generateArticle(keyword, model, isJSON = false) {
    const style = getRandomElement(styles);
    const prompt = `你是一位小红书资深博主，请以${style}的风格，围绕"${keyword}"这个主题创作一篇吸引人的文案。要求：

    1. 标题要极具创意，不要直接用"${keyword}"开头，而是用相关的吸引人的表达方式，比如：
       - 让人意想不到的发现
       - 令人惊喜的体验
       - 解决痛点的妙招
       - 新奇有趣的玩法
       - 独特的个人感受
    
    2. 正文要求：
       - 用故事化或者场景化的方式展开
       - 每段不超过50字，要有感染力
       - 语气要自然活泼，像跟闺蜜聊天
       - 分享真实经历或有价值的观点
       - 总字数300-500字
       - 内容要发散思维，不要局限于${keyword}本身，可以联想相关的场景、故事、体验等
    
    请直接输出文案内容，不要加其他解释。`;

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: model,
            prompt: prompt,
            stream: false
        });

        // 清理AI返回的内容
        const cleanContent = cleanAIResponse(response.data.response);
        
        // 根据格式选择返回内容
        return isJSON 
            ? formatArticleToJSON(cleanContent, keyword, style, model)
            : formatArticle(cleanContent);
    } catch (error) {
        console.error('生成文案时出错:', error.message);
        return null;
    }
}

// 获取下一个可用的文件序号
function getNextFileNumber(keyword, extension) {
    const files = fs.readdirSync(outputDir);
    const pattern = new RegExp(`${keyword}_文案_(\\d+)\\.${extension}$`);
    let maxNum = 0;

    files.forEach(file => {
        const match = file.match(pattern);
        if (match) {
            const num = parseInt(match[1]);
            maxNum = Math.max(maxNum, num);
        }
    });

    return maxNum + 1;
}

async function main() {
    // 运行前执行命令设置控制台编码
    require('child_process').execSync('chcp 65001', { stdio: 'inherit' });
    
    console.log('\x1b[36m%s\x1b[0m', '欢迎使用小红书文案生成器！✨\n');
    
    // 选择模型
    const selectedModel = await selectModel();
    console.log(`\n\x1b[32m已选择模型: ${selectedModel}\x1b[0m\n`);
    
    const keyword = readlineSync.question('\x1b[33m请输入文案关键词: \x1b[0m');
    const count = parseInt(readlineSync.question('\x1b[33m请输入需要生成的文案数量: \x1b[0m'));
    const isJSON = readlineSync.keyInYN('\x1b[33m是否使用JSON格式输出？(Y/N): \x1b[0m');

    console.log('\n\x1b[36m开始生成文案，请稍候...\x1b[0m\n');

    // 获取起始序号
    const extension = isJSON ? 'json' : 'txt';
    let startNum = getNextFileNumber(keyword, extension);

    for (let i = 0; i < count; i++) {
        const article = await generateArticle(keyword, selectedModel, isJSON);
        if (article) {
            const filename = path.join(outputDir, `${keyword}_文案_${startNum + i}.${extension}`);
            fs.writeFileSync(filename, article, 'utf8');
            console.log('\x1b[32m✅ 已生成第 ' + (i + 1) + ' 篇文案，保存至: ' + filename + '\x1b[0m');
        }
    }

    console.log('\n\x1b[35m🎉 文案生成完成！请在 generated_articles 文件夹中查看生成的文案。\x1b[0m');
}

main().catch(console.error); 