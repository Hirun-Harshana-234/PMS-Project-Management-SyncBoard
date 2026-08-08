const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const DEFAULT_USERS=[
 {username:'hirun',password:'sync123',name:'Hirun',role:'Member',email:'hirun@syncboard.dev'},
 {username:'methul',password:'sync123',name:'Methul',role:'Member',email:'methul@syncboard.dev'},
 {username:'disen',password:'sync123',name:'Disen',role:'Member',email:'disen@syncboard.dev'},
 {username:'nethushi',password:'sync123',name:'Nethushi',role:'Member',email:'nethushi@syncboard.dev'},
 {username:'hasini',password:'sync123',name:'Hasini',role:'Member',email:'hasini@syncboard.dev'},
 {username:'kaveesha',password:'sync123',name:'Kaveesha',role:'Member',email:'kaveesha@syncboard.dev'}
];
function normalizeUsername(value=''){return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g,'')}
function repairUsers(users){
  if(!Array.isArray(users))return DEFAULT_USERS.map(u=>({...u,password:String(u.password||'sync123')}));
  return users.map((u,index)=>({
    ...u,
    username:String(u?.username||'').trim()||normalizeUsername(u?.name)||`member${index+1}`,
    password:String(u?.password||'sync123'),
    name:String(u?.name||'').trim()||String(u?.username||'').trim()||`Member ${index+1}`,
    role:u?.role||'Member',
    email:u?.email||''
  }));
}
function findUserByLogin(input,password){
  const trimmedInput=String(input||'').trim();
  const normalizedInput=normalizeUsername(trimmedInput);
  const expectedPassword=String(password||'');
  return getUsers().find(user=>{
    if(String(user.password||'')!==expectedPassword)return false;
    const username=String(user.username||'');
    const name=String(user.name||'');
    const aliases=[username,name,normalizeUsername(username),normalizeUsername(name)];
    return aliases.some(alias=>normalizeUsername(alias)===normalizedInput) || username.toLowerCase()===trimmedInput.toLowerCase() || name.toLowerCase()===trimmedInput.toLowerCase();
  });
}
const MEMBERS=[
 {name:'Hirun Harshana',role:'UI/UX Designer',email:'hirun@syncboard.dev',progress:78,department:'Design'},
 {name:'Methul Demika',role:'Backend Developer',email:'methul@syncboard.dev',progress:64,department:'Engineering'},
 {name:'Disen Devmika',role:'DevOps Engineer',email:'disen@syncboard.dev',progress:90,department:'Infrastructure'},
 {name:'nethushi aloka',role:'Frontend Developer',email:'nethushi@syncboard.dev',progress:88,department:'Engineering'},
 {name:'Hasini Gunathilake',role:'QA Engineer',email:'hasini@syncboard.dev',progress:72,department:'Quality'},
  {name:'Kaveesha Navodi',role:'QA Engineer',email:'kaveesha@syncboard.dev',progress:72,department:'Quality'},

];
const INITIAL_TASKS=[
 {id:1,title:'Landing page UI',description:'Create responsive dashboard landing page.',assignee:'Hirun Harshana',status:'ongoing',progress:75,priority:'High',due:'2026-08-15',comments:['Responsive desktop section completed.']},
 {id:2,title:'API integration',description:'Connect task services to the client.',assignee:'Methul Demika',status:'assigned',progress:35,priority:'High',due:'2026-08-18',comments:['Waiting for endpoint confirmation.']},
 {id:3,title:'Database setup',description:'Prepare schema and sample project data.',assignee:'Disen Devmika',status:'ongoing',progress:90,priority:'Medium',due:'2026-08-12',comments:['Final migration test running.']},
 {id:4,title:'Authentication',description:'Create account/session flow.',assignee:'Nethushi.Aloka',status:'done',progress:100,priority:'High',due:'2026-08-10',comments:['Completed and reviewed.']},
 {id:5,title:'UI components',description:'Build reusable form and card components.',assignee:'Hasini Gunathilake',status:'done',progress:100,priority:'Medium',due:'2026-08-11',comments:['Reusable components complete.']},
 {id:6,title:'UI components',description:'Build reusable form and card components.',assignee:'Kaveesha Navodi',status:'done',progress:100,priority:'Medium',due:'2026-08-11',comments:['Reusable components complete.']}
];
function safeJSON(s,fallback){try{return JSON.parse(s)}catch{return fallback}}
function getTasks(){let t=safeJSON(localStorage.getItem('syncboard-tasks'),null);if(!t){localStorage.setItem('syncboard-tasks',JSON.stringify(INITIAL_TASKS));return [...INITIAL_TASKS]}return t}
function getUsers(){
 const stored=safeJSON(localStorage.getItem('syncboard-users'),null);
 if(!stored){
   const defaults=repairUsers(DEFAULT_USERS);
   localStorage.setItem('syncboard-users',JSON.stringify(defaults));
   return defaults;
 }
 const repaired=repairUsers(stored);
 if(JSON.stringify(repaired)!==JSON.stringify(stored))localStorage.setItem('syncboard-users',JSON.stringify(repaired));
 return repaired;
}
function saveUsers(users){localStorage.setItem('syncboard-users',JSON.stringify(repairUsers(users)))}
function getNotifications(){return safeJSON(localStorage.getItem('syncboard-notifications'),'')||[]}
function getRequests(){return safeJSON(localStorage.getItem('syncboard-requests'),null)||[]}
function saveRequests(items){localStorage.setItem('syncboard-requests',JSON.stringify(items));publishUpdate('requests')}
function saveNotifications(items){localStorage.setItem('syncboard-notifications',JSON.stringify(items));publishUpdate('notifications')}
function addNotification({recipient='all',title,message,type='info'}){const items=getNotifications();items.unshift({id:Date.now()+Math.random(),recipient,title,message,type,createdAt:new Date().toISOString(),readBy:[]});saveNotifications(items.slice(0,100))}
function saveTasks(t){localStorage.setItem('syncboard-tasks',JSON.stringify(t));publishUpdate('tasks')}
let syncChannel=null;
function getSyncChannel(){if(!syncChannel&&'BroadcastChannel' in window)syncChannel=new BroadcastChannel('syncboard-live');return syncChannel}
function publishUpdate(kind){const c=getSyncChannel();if(c)c.postMessage({type:'updated',kind,ts:Date.now()});window.dispatchEvent(new CustomEvent('syncboard:updated',{detail:{kind}}))}
function currentUser(){return safeJSON(sessionStorage.getItem('syncboard-user'),null)||safeJSON(localStorage.getItem('syncboard-user'),null)}
function requireAuth(){if(!currentUser()&&!location.pathname.endsWith('index.html')&&!location.pathname.endsWith('/')) location.replace('index.html')}
function hydrateUser(){const u=currentUser();if(!u)return;$$('[data-user-name]').forEach(e=>e.textContent=u.name);$$('[data-user-role]').forEach(e=>e.textContent=u.role);$$('[data-avatar]').forEach(e=>e.textContent=u.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase())}
function applyTheme(){const t=localStorage.getItem('syncboard-theme');document.body.classList.toggle('dark',t==='dark')}
function toggleTheme(){document.body.classList.toggle('dark');localStorage.setItem('syncboard-theme',document.body.classList.contains('dark')?'dark':'light')}
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function logout(){sessionStorage.removeItem('syncboard-user');localStorage.removeItem('syncboard-user');location.href='index.html'}
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function statusBadge(s){return `<span class="badge ${s}">${s[0].toUpperCase()+s.slice(1)}</span>`}
function initNav(){ $$('[data-theme]').forEach(b=>b.onclick=toggleTheme); $$('[data-menu]').forEach(b=>b.onclick=()=>$('.sidebar')?.classList.toggle('open')); $$('[data-logout]').forEach(b=>b.onclick=logout); }
function initLogin(){
 const f=$('#loginForm');if(!f)return;
 if(currentUser()){location.replace('home.html');return}
 $('#togglePass')?.addEventListener('click',()=>{const p=$('#password');p.type=p.type==='password'?'text':'password'});
 f.addEventListener('submit',e=>{e.preventDefault();const u=$('#username').value.trim(),p=$('#password').value;const found=findUserByLogin(u,p);if(!found){$('#loginError').textContent='Invalid username or password.';return}const data={username:found.username,name:found.name,role:found.role,email:found.email};($('#remember').checked?localStorage:sessionStorage).setItem('syncboard-user',JSON.stringify(data));location.href='home.html'});
}
function initNotificationCenter(){
 const themeBtn=$('[data-theme]');if(!themeBtn||$('#notificationButton'))return;
 const wrap=document.createElement('div');wrap.className='notification-wrap';wrap.innerHTML=`<button class="icon-btn notification-button" id="notificationButton" title="Notifications">🔔<span class="notification-count" id="notificationCount">0</span></button><div class="notification-popover" id="notificationPopover"><div class="notification-head"><strong>Notifications</strong><button class="mini" id="markAllRead">Mark all read</button></div><div class="notification-list" id="notificationList"></div></div>`;
 themeBtn.parentNode.insertBefore(wrap,themeBtn);
 $('#notificationButton').onclick=e=>{e.stopPropagation();$('#notificationPopover').classList.toggle('open');renderNotificationCenter()};
 $('#markAllRead').onclick=()=>{const u=currentUser();if(!u)return;const items=getNotifications();items.forEach(n=>{if(notificationForUser(n,u)&&!n.readBy.includes(u.username))n.readBy.push(u.username)});saveNotifications(items);renderNotificationCenter()};
 document.addEventListener('click',e=>{if(!wrap.contains(e.target))$('#notificationPopover')?.classList.remove('open')});
 renderNotificationCenter();
}
function notificationForUser(n,u){return n.recipient==='all'||n.recipient===u.name||n.recipient===u.username}
function renderNotificationCenter(){const u=currentUser(),list=$('#notificationList'),count=$('#notificationCount');if(!u||!list||!count)return;const items=getNotifications().filter(n=>notificationForUser(n,u));const unread=items.filter(n=>!n.readBy.includes(u.username)).length;count.textContent=unread;count.classList.toggle('hidden',unread===0);list.innerHTML=items.length?items.slice(0,12).map(n=>`<div class="notification-item ${n.readBy.includes(u.username)?'':'unread'}"><strong>${escapeHTML(n.title)}</strong><div>${escapeHTML(n.message)}</div><small>${new Date(n.createdAt).toLocaleString()}</small></div>`).join(''):'<div class="empty-note">No notifications yet.</div>'}
function registerRealtimeSync(){const c=getSyncChannel();if(c)c.addEventListener('message',()=>{renderTasks();renderMembers();renderNotificationCenter();renderMemberRequests()});window.addEventListener('storage',e=>{if(['syncboard-tasks','syncboard-notifications','syncboard-members','syncboard-requests'].includes(e.key)){renderTasks();renderMembers();renderNotificationCenter();renderMemberRequests()}});window.addEventListener('syncboard:updated',()=>{renderTasks();renderMembers();renderNotificationCenter();renderMemberRequests()})}
function taskCard(t){const u=currentUser();const canUpdate=u&&t.assignee===u.name;return `<article class="task" data-task="${t.id}"><div class="task-top"><div class="task-title">${escapeHTML(t.title)}</div>${statusBadge(t.status)}</div><div class="small muted" style="margin-top:6px">${escapeHTML(t.description||'')}</div><div class="meta"><span>${escapeHTML(t.assignee)}</span><span>${t.progress}%</span></div><div class="progress"><span style="width:${Math.max(0,Math.min(100,t.progress))}%"></span></div><div class="comments">💬 ${(t.comments||[]).length} update(s) · Due ${escapeHTML(t.due||'—')}</div><div class="task-actions"><button class="mini" onclick="openTask(${t.id})">${canUpdate?'View / Update':'View Details'}</button></div></article>`}
function renderTasks(){const board=$('#taskBoard');if(!board)return;let tasks=getTasks();const q=($('#taskSearch')?.value||'').toLowerCase(),assignee=$('#taskMemberFilter')?.value||'all';tasks=tasks.filter(t=>(t.title+' '+t.assignee+' '+t.description).toLowerCase().includes(q)&&(assignee==='all'||t.assignee===assignee));const groups={assigned:[],ongoing:[],done:[]};tasks.forEach(t=>(groups[t.status]||groups.assigned).push(t));board.innerHTML=['assigned','ongoing','done'].map(s=>`<section class="column"><div class="column-head"><h3>${s[0].toUpperCase()+s.slice(1)}</h3><span class="badge ${s}">${groups[s].length}</span></div>${groups[s].map(taskCard).join('')||'<p class="muted small">No tasks here.</p>'}</section>`).join('')}
window.openTask=function(id){const t=getTasks().find(x=>x.id===id);if(!t)return;const u=currentUser(),canUpdate=u&&t.assignee===u.name;$('#taskModal').classList.add('open');$('#modalTaskTitle').textContent=t.title;$('#modalTaskId').value=t.id;$('#modalStatus').value=t.status;$('#modalProgress').value=t.progress;$('#modalAssignee').value=t.assignee;$('#modalStatus').disabled=!canUpdate;$('#modalProgress').disabled=!canUpdate;$('#modalAssignee').disabled=true;$('#newComment').disabled=!canUpdate;$('#saveTaskButton').classList.toggle('hidden',!canUpdate);$('#commentList').innerHTML=(t.comments||[]).map(c=>`<div class="comment">${escapeHTML(c)}</div>`).join('')||'<div class="muted small">No updates.</div>'}
window.closeTask=function(){$('#taskModal')?.classList.remove('open')}
window.saveTaskUpdate=function(){const id=Number($('#modalTaskId').value),tasks=getTasks(),t=tasks.find(x=>x.id===id),u=currentUser();if(!t||!u||t.assignee!==u.name){toast('Only the assigned member can update this task');return}const oldProgress=t.progress,oldStatus=t.status;t.status=$('#modalStatus').value;t.progress=Math.max(0,Math.min(100,Number($('#modalProgress').value)));const c=$('#newComment').value.trim();if(c)(t.comments||(t.comments=[])).push(`${u.name}: ${c}`);saveTasks(tasks);addNotification({recipient:'admin',title:'Task updated',message:`${u.name} updated “${t.title}” from ${oldProgress}%/${oldStatus} to ${t.progress}%/${t.status}.`,type:'task'});closeTask();renderTasks();toast('Task update saved')}
function initTaskPage(){if(!$('#taskBoard'))return;const filter=$('#taskMemberFilter');if(filter){const selected=filter.value;filter.innerHTML='<option value="all">All Members</option>'+getMembers().map(m=>`<option>${escapeHTML(m.name)}</option>`).join('');filter.value=[...filter.options].some(o=>o.value===selected)?selected:'all';filter.addEventListener('change',renderTasks)}$('#taskSearch')?.addEventListener('input',renderTasks);renderTasks()}
function getMembers(){return safeJSON(localStorage.getItem('syncboard-members'),null)||MEMBERS}
function renderMembers(){const g=$('#memberGrid');if(!g)return;const tasks=getTasks();g.innerHTML=getMembers().map(m=>{const own=tasks.filter(t=>t.assignee===m.name);const avg=own.length?Math.round(own.reduce((a,t)=>a+t.progress,0)/own.length):Number(m.progress||0);return `<article class="panel member-card"><div class="avatar">${m.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2)}</div><h3>${escapeHTML(m.name)}</h3><p>${escapeHTML(m.role)}</p><p class="small">${escapeHTML(m.department)}</p><div class="progress" style="margin:14px 0"><span style="width:${avg}%"></span></div><strong>${own.length} task(s) · ${avg}% avg.</strong></article>`}).join('')}

function requestStatusBadge(status){const label={pending:'Pending',reviewing:'Reviewing',completed:'Completed',rejected:'Rejected'}[status]||status;return `<span class="request-status ${escapeHTML(status)}">${escapeHTML(label)}</span>`}
function renderMemberRequests(){const box=$('#memberRequestList'),u=currentUser();if(!box||!u)return;const items=getRequests().filter(r=>r.memberUsername===u.username).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));box.innerHTML=items.length?items.map(r=>`<article class="request-card"><div class="request-card-head"><div><strong>${escapeHTML(r.category)}</strong><div class="small muted">${new Date(r.createdAt).toLocaleString()}${r.taskTitle?` · ${escapeHTML(r.taskTitle)}`:''}</div></div>${requestStatusBadge(r.status)}</div><p>${escapeHTML(r.message)}</p><div class="request-meta"><span class="priority-dot ${escapeHTML(String(r.priority||'normal').toLowerCase())}"></span>${escapeHTML(r.priority||'Normal')} priority</div>${r.adminNote?`<div class="admin-response"><strong>Admin response</strong><div>${escapeHTML(r.adminNote)}</div></div>`:''}</article>`).join(''):'<div class="empty-note">You have not sent any admin requests yet.</div>'}
function initAdminRequestPage(){const f=$('#adminRequestForm'),u=currentUser();if(!f||!u)return;const taskSelect=$('#requestTaskSelect');if(taskSelect){getTasks().filter(t=>t.assignee===u.name).forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.title;taskSelect.appendChild(o)})}f.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(f),task=getTasks().find(t=>String(t.id)===String(fd.get('taskId'))),req={id:Date.now()+Math.random(),memberUsername:u.username,memberName:u.name,category:fd.get('category'),priority:fd.get('priority'),taskId:fd.get('taskId')||'',taskTitle:task?.title||'',message:String(fd.get('message')||'').trim(),status:'pending',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),adminNote:''};const items=getRequests();items.unshift(req);saveRequests(items.slice(0,100));addNotification({recipient:'admin',title:'New member request',message:`${u.name} sent a ${req.priority.toLowerCase()} priority ${req.category.toLowerCase()} request${req.taskTitle?` for “${req.taskTitle}”`:''}.`,type:'request'});f.reset();renderMemberRequests();toast('Request sent to admin')});renderMemberRequests()}

document.addEventListener('DOMContentLoaded',()=>{applyTheme();initLogin();if(!$('#loginForm')){requireAuth();hydrateUser();initNav();initNotificationCenter();registerRealtimeSync();initTaskPage();renderMembers();initAdminRequestPage();renderMemberRequests()}})
