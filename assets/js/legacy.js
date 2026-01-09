(function(){
  const $ = (s, r=document) => r.querySelector(s);

  // ====== 数据区（可改） ======
  const NEWS_ITEMS = [
    {date:"2026-01-09", title:"国务院办公厅发布关于进一步规范信息发布工作的通知", tag:"通知", url:"#"},
    {date:"2026-01-08", title:"港澳工作领导小组召开专题会议研究部署有关工作", tag:"要闻", url:"#"},
    {date:"2026-01-07", title:"海南有关部门就公共服务事项办理流程发布说明", tag:"公告", url:"#"},
    {date:"2026-01-05", title:"关于加强重点领域风险防控工作的若干措施", tag:"工作部署", url:"#"},
    {date:"2026-01-03", title:"政务服务事项清单（港澳琼）更新", tag:"服务清单", url:"#"}
  ];

  const DOC_ITEMS = [
    {date:"2026-01-08", title:"关于加强应急状态下社会管理措施的指导意见", type:"PDF", dept:"国务院办公厅", url:"#"},
    {date:"2026-01-07", title:"港澳琼地区公共安全工作规范（试行）", type:"DOC", dept:"有关部门", url:"#"},
    {date:"2026-01-05", title:"信息发布与媒体管理工作规程（修订）", type:"PDF", dept:"有关部门", url:"#"},
    {date:"2025-12-28", title:"政务公开工作要点（年度）", type:"PDF", dept:"国务院办公厅", url:"#"}
  ];

  const EMERGENCY_ITEMS = [
    {date:"2026-01-03", title:"关于部分区域临时管理措施的通告", level:"重要", url:"#"},
    {date:"2026-01-02", title:"关于大型活动安全管理要求的提示", level:"提示", url:"#"},
    {date:"2025-12-30", title:"关于公共交通运行秩序维护的公告", level:"公告", url:"#"},
    {date:"2025-12-26", title:"关于通信与信息安全事项的提醒", level:"提醒", url:"#"}
  ];

  // 站内索引（用于 search.html 前端搜索）
  const SITE_INDEX = [
    {title:"新闻公告", url:"news.html", keywords:"新闻 公告 要闻 通知"},
    {title:"政策文件", url:"documents.html", keywords:"文件 政策 规范 PDF DOC 下载"},
    {title:"应急与特别措施", url:"emergency.html", keywords:"应急 特别 措施 通告 提示 安全 管理"},
    {title:"港澳琼工作", url:"regions.html", keywords:"港澳 琼 海南 区域 工作 动态"},
    {title:"机构设置", url:"organizations.html", keywords:"机构 部门 直属 单位 联系"},
    {title:"统一检索", url:"search.html", keywords:"检索 搜索 查询"}
  ];

  // ====== 公共：顶部日期 ======
  const now = new Date();
  const pad = (n)=> String(n).padStart(2,"0");
  const w = "日一二三四五六"[now.getDay()];
  const dateStr = `${now.getFullYear()}年${pad(now.getMonth()+1)}月${pad(now.getDate())}日 星期${w}`;
  const dateEl = $("#today");
  if (dateEl) dateEl.textContent = dateStr;

  // ====== 公共：顶部搜索框（跳转到 search.html?q=） ======
  const topQ = $("#topQ");
  const topBtn = $("#topSearchBtn");
  function goSearch(q){
    const qq = (q||"").trim();
    if(!qq){ alert("请输入关键字"); return; }
    location.href = `search.html?q=${encodeURIComponent(qq)}`;
  }
  if(topBtn && topQ){
    topBtn.addEventListener("click", ()=> goSearch(topQ.value));
    topQ.addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); goSearch(topQ.value); }});
  }

  // ====== 首页渲染 ======
  const newsUl = $("#homeNews");
  if (newsUl){
    newsUl.innerHTML = NEWS_ITEMS.slice(0,8).map(x=>`
      <li>
        <a href="${x.url}">${escapeHtml(x.title)}</a>
        <span class="date">${x.date}</span>
      </li>
    `).join("");
  }

  const docsTbl = $("#homeDocs");
  if (docsTbl){
    docsTbl.innerHTML = DOC_ITEMS.slice(0,6).map(d=>`
      <tr>
        <td>${d.date}</td>
        <td><a href="${d.url}">${escapeHtml(d.title)}</a></td>
        <td>${escapeHtml(d.dept)}</td>
        <td>${escapeHtml(d.type)}</td>
      </tr>
    `).join("");
  }

  const emUl = $("#homeEmergency");
  if (emUl){
    emUl.innerHTML = EMERGENCY_ITEMS.slice(0,6).map(x=>`
      <li>
        <a href="${x.url}">【${escapeHtml(x.level)}】${escapeHtml(x.title)}</a>
        <span class="date">${x.date}</span>
      </li>
    `).join("");
  }

  // ====== news.html 列表 ======
  const newsList = $("#newsList");
  if (newsList){
    newsList.innerHTML = NEWS_ITEMS.map(x=>`
      <li>
        <a href="${x.url}">${escapeHtml(x.title)}</a>
        <span class="date">${x.date}</span>
      </li>
    `).join("");
  }

  // ====== documents.html 列表 ======
  const docBody = $("#docBody");
  if (docBody){
    docBody.innerHTML = DOC_ITEMS.map(d=>`
      <tr>
        <td>${d.date}</td>
        <td><a href="${d.url}">${escapeHtml(d.title)}</a></td>
        <td>${escapeHtml(d.dept)}</td>
        <td>${escapeHtml(d.type)}</td>
      </tr>
    `).join("");
  }

  // ====== emergency.html 列表 ======
  const emList = $("#emList");
  if (emList){
    emList.innerHTML = EMERGENCY_ITEMS.map(x=>`
      <li>
        <a href="${x.url}">【${escapeHtml(x.level)}】${escapeHtml(x.title)}</a>
        <span class="date">${x.date}</span>
      </li>
    `).join("");
  }

  // ====== search.html 搜索 ======
  const q = getParam("q");
  const qInput = $("#q");
  const resultBox = $("#resultBox");
  const hint = $("#hint");
  const btn = $("#searchBtn");

  if (qInput && typeof q === "string") qInput.value = q;

  function doSearch(){
    const qq = (qInput ? qInput.value : "").trim().toLowerCase();
    if(!qq){ alert("请输入关键字"); return; }
    const hits = SITE_INDEX.filter(x => (x.title + " " + x.keywords).toLowerCase().includes(qq));
    if (hint) hint.textContent = `检索结果：${hits.length} 项`;
    if (resultBox){
      resultBox.innerHTML = hits.length ? `
        <ul class="list">
          ${hits.map(h=>`
            <li>
              <a href="${h.url}">${escapeHtml(h.title)}</a>
              <span class="date">—</span>
            </li>
          `).join("")}
        </ul>
      ` : `<div class="panel"><div class="bd">未检索到相关内容。</div></div>`;
    }
    // 更新地址栏参数
    const u = new URL(location.href);
    u.searchParams.set("q", qq);
    history.replaceState({}, "", u.toString());
  }

  if(btn && qInput){
    btn.addEventListener("click", doSearch);
    qInput.addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); doSearch(); }});
  }

  // 自动执行一次（若带 q）
  if (resultBox && q && q.trim()) {
    if (hint) hint.textContent = "检索中…";
    // 让 UI 先渲染再搜
    setTimeout(doSearch, 0);
  }

  // ====== helpers ======
  function getParam(name){
    try{
      const u = new URL(location.href);
      return u.searchParams.get(name) || "";
    }catch{
      return "";
    }
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
})();
