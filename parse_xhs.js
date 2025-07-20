// xhs.js
const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const express = require('express');
const bodyParser = require('body-parser');

puppeteer.use(StealthPlugin());

class XhsClient {
  constructor({ cookie, userAgent }) {
    this.cookie = cookie;
    this.userAgent = userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
    this.baseUrl = 'https://edith.xiaohongshu.com';
  }

  // 获取笔记详情
  async getNoteById(noteId, xsecToken) {
    const uri = '/api/sns/web/v1/feed';
    const data = {
      source_note_id: noteId,
      image_formats: ['jpg', 'webp', 'avif'],
      extra: { need_body_topic: 1 },
      xsec_source: 'pc_feed',
      xsec_token: xsecToken
    };
    // 通过签名服务获取签名
    const a1 = this.getA1FromCookie();
    console.log(`[签名服务] 请求开始: noteId=${noteId}`);
    const signStart = Date.now();
    const signResp = await axios.post('http://localhost:3001/api/xhs/sign', {
      uri,
      data,
      a1
    });
    const signDuration = Date.now() - signStart;
    console.log(`[签名服务] 请求结束: noteId=${noteId}, 用时: ${signDuration}ms`);
    const signs = signResp.data;
    const headers = {
      'user-agent': this.userAgent,
      'cookie': this.cookie,
      'x-s': signs['x-s'],
      'x-t': signs['x-t'],
      'content-type': 'application/json'
    };
    console.log(`[小红书API] 请求开始: noteId=${noteId}`);
    const xhsStart = Date.now();
    const resp = await axios.post(this.baseUrl + uri, data, { headers });
    const xhsDuration = Date.now() - xhsStart;
    console.log(`[小红书API] 请求结束: noteId=${noteId}, 用时: ${xhsDuration}ms`);
    return resp.data;
  }

  getA1FromCookie() {
    const match = this.cookie.match(/a1=([^;]+)/);
    return match ? match[1] : '';
  }
}

const app = express();
const port = 3000;

app.use(bodyParser.json());

async function getCookieWithA1() {
  // 原始cookie字符串（a1值可随意，后面会替换）
  let cookie = 'a1=xxxx; webId=41274e290eb75cf0dc5a0700e73ea402; gid=yjq84JDJyDvWyjq84JDyfJiU0fuUCxSVEjhMy4A7IK0EF288FF6Kqq888qy2YK28fdS2qd0W; customerClientId=052308199802510; abRequestId=41274e290eb75cf0dc5a0700e73ea402; x-user-id-creator.xiaohongshu.com=6534ea710000000004008adb; x-user-id-school.xiaohongshu.com=6534ea710000000004008adb; x-user-id-chengfeng.xiaohongshu.com=6534ea710000000004008adb; x-user-id-fuwu.xiaohongshu.com=6534ea710000000004008adb; timestamp2=17327615622290744b171fecebaa376d1b62c195a96b1b9eb3cad2260962819; timestamp2.sig=RMMliP0Lhuz4j_rrYauTmvAsaNa5L-lHSs0JPe-PxyY; x-user-id-pro.xiaohongshu.com=6534ea710000000004008adb; x-user-id-ark.xiaohongshu.com=6534ea710000000004008adb; access-token-ark.xiaohongshu.com=customer.ark.AT-68c517517105393042468991zju01pgd1qlwkmaj; webBuild=4.72.0; web_session=040069b440a93942da8d7788453a4bc51cb994; xsecappid=xhs-pc-web; unread={%22ub%22:%22684e974b000000002202baeb%22%2C%22ue%22:%226870a227000000001c031995%22%2C%22uc%22:24}; websectiga=6169c1e84f393779a5f7de7303038f3b47a78e47be716e7bec57ccce17d45f99; sec_poison_id=b5e036a4-53bd-43e2-bf56-af01407a82cb; acw_tc=0a50887c17523289428773120e5fe439644c3d2079d04aa8a01a59d7f3225d; loadts=1752329155964';
  // 获取最新a1
  const a1Resp = await axios.get('http://localhost:3001/a1');
  const a1 = a1Resp.data.a1;
  // 替换cookie中的a1
  cookie = cookie.replace(/a1=[^;]*/, 'a1=' + a1);
  return cookie;
}

(async () => {
  const cookie = await getCookieWithA1();
  const xhs = new XhsClient({ cookie });

  // 路由：获取小红书笔记详情
  app.get('/api/xhs/note', async (req, res) => {
    //const { noteId, xsecToken } = req.query;
    let noteId = '6853728100000000100115d2';
    let xsecToken = 'CBiXaPQ7DY49hi1A5zx8NHkwMtYfnroV4EAzSgel2N0Tc=';
    const reqStart = Date.now();
    console.log(`[API] /api/xhs/note 请求开始: noteId=${noteId}`);
    if (!noteId || !xsecToken) {
      return res.status(400).json({ error: '缺少 noteId 或 xsecToken' });
    }
    try {
      const note = await xhs.getNoteById(noteId, xsecToken);
      const reqDuration = Date.now() - reqStart;
      console.log(`[API] /api/xhs/note 请求结束: noteId=${noteId}, 总用时: ${reqDuration}ms`);
      res.json(note);
    } catch (e) {
      const reqDuration = Date.now() - reqStart;
      console.log(`[API] /api/xhs/note 请求异常: noteId=${noteId}, 总用时: ${reqDuration}ms, 错误: ${e.message}`);
      res.status(500).json({ error: e.message });
    }
  });

  app.listen(port, () => {
    console.log(`小红书解析服务已启动: http://localhost:${port}`);
  });
})();

module.exports = XhsClient;


