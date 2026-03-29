
(function(){
    const ICONS = {
        check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        bookmark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
        pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        sparkle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        doc: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        party: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z"/></svg>',
        books: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    };

    /* === PARTICLES === */
    const pEl = document.getElementById('particles');
    for(let i=0;i<28;i++){
        const d = document.createElement('div');
        d.classList.add('particle');
        const s = Math.random()*3.5+1.5;
        const isO = Math.random()>.55;
        d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;background:${isO?'rgba(247,148,29,.45)':'rgba(32,104,178,.35)'};animation-duration:${Math.random()*9+5}s;animation-delay:${Math.random()*7}s;`;
        pEl.appendChild(d);
    }

    /* === PROGRESS BAR SCROLL === */
    const prog = document.getElementById('progressBar');
    window.addEventListener('scroll',()=>{
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if(prog) prog.style.width = h>0?(y/h*100)+'%':'0%';
    });

    /* === BACK TO TOP === */
    const btt = document.getElementById('btt');
    if(btt) btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll',()=>{ if(btt) btt.classList.toggle('show',window.scrollY>500); });

    /* === TOAST === */
    function toast(icon,msg){
        const t=document.getElementById('toast');
        const ti=document.getElementById('toastIco');
        const tm=document.getElementById('toastMsg');
        ti.innerHTML=icon;tm.textContent=msg;
        t.classList.add('on');
        clearTimeout(t._t);
        t._t=setTimeout(()=>t.classList.remove('on'),3200);
    }

    /* === NEWSLETTER === */
    document.getElementById('nlForm').addEventListener('submit',e=>{
        e.preventDefault();
        const em=document.getElementById('nlEmail');
        if(em.value){toast(ICONS.party,'Subscribed! Welcome to the SetuNxt community.');em.value=''}
    });

    /* === BOOKMARKS === */
    document.addEventListener('click',e=>{
        const b=e.target.closest('.bm-btn');
        if(!b)return;e.stopPropagation();
        b.classList.toggle('saved');
        toast(b.classList.contains('saved')?ICONS.pin:ICONS.trash, b.classList.contains('saved')?'Article bookmarked successfully':'Bookmark removed');
    });

    /* === CATEGORY FILTER === */
    const fBtns=document.querySelectorAll('.f-btn');
    const getCards=()=>document.querySelectorAll('.card');
    const feat=document.getElementById('featured');
    fBtns.forEach(btn=>btn.addEventListener('click',()=>{
        fBtns.forEach(b=>b.classList.remove('on'));
        btn.classList.add('on');
        const cat=btn.dataset.cat;
        getCards().forEach((c,i)=>{
            const show=cat==='all'||c.dataset.cat===cat;
            if(show){c.style.display='';c.style.animation=`fadeUp .5s ease ${i*.05}s both`}
            else{c.style.display='none'}
        });
        feat.style.display=(cat==='all'||feat.dataset.cat===cat)?'':'none';
    }));

    /* === SEARCH === */
    const sI=document.getElementById('searchInput');
    const sB=document.getElementById('searchBtn');
    function doSearch(){
        const q=sI.value.toLowerCase().trim();
        if(!q){getCards().forEach(c=>{c.style.display='';c.style.animation=''});feat.style.display='';return}
        let n=0;
        getCards().forEach(c=>{const t=c.textContent.toLowerCase();const s=t.includes(q);c.style.display=s?'':'none';if(s)n++});
        const fs=feat.textContent.toLowerCase().includes(q);feat.style.display=fs?'':'none';if(fs)n++;
        toast(ICONS.search, n?`Found ${n} result${n>1?'s':''}`:`No results for "${sI.value}"`);
    }
    sB.addEventListener('click',doSearch);
    sI.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});

    /* === LOAD MORE === */
    const lmBtn=document.getElementById('loadMore');
    const grid=document.getElementById('grid');
    const extra=[
        {cat:'dev',tag:'API & Dev',title:'Webhooks & Real-Time Event Handling in RCS',desc:'Set up webhooks for delivery receipts, read confirmations, and user interaction callbacks.',author:'Dev Patel',init:'DP',avCls:'av-teal',date:'Dec 22, 2024',img:'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop'},
        {cat:'marketing',tag:'Marketing',title:'AI-Powered Personalization at Scale for RCS Campaigns',desc:'Machine learning driven hyper-personalized RCS messaging campaigns that convert at 5x the rate.',author:'Sneha Gupta',init:'SG',avCls:'av-orange',date:'Dec 18, 2024',img:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop'},
        {cat:'rcs',tag:'RCS',title:'RCS for E-commerce: Interactive Shopping via Messages',desc:'Transform your e-commerce journey with product carousels, in-message payments, and order tracking.',author:'Arjun Nair',init:'AN',avCls:'av-blue',date:'Dec 14, 2024',img:'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=500&h=300&fit=crop'},
        {cat:'strategy',tag:'Strategy',title:'Omnichannel Mastery: RCS in Your Full Messaging Stack',desc:'Strategic guide to incorporating RCS alongside email, push, and social for unified engagement.',author:'Kavita Rao',init:'KR',avCls:'av-indigo',date:'Dec 10, 2024',img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop'}
    ];
    let loaded=0;
    lmBtn.addEventListener('click',()=>{
        if(loaded>=extra.length){toast(ICONS.books,"You've read all articles!");return}
        lmBtn.classList.add('loading');lmBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Loading...';
        setTimeout(()=>{
            const batch=extra.slice(loaded,loaded+2);
            batch.forEach((p,i)=>{
                const el=document.createElement('article');
                el.className='card';el.dataset.cat=p.cat;
                el.style.animation=`fadeUp .6s ease ${i*.12}s both`;
                el.innerHTML=`
                    <div class="card-img">
                        <img src="${p.img}" alt="${p.title}">
                        <div class="img-overlay"></div>
                        <span class="c-tag">${p.tag}</span>
                        <button class="bm-btn" title="Bookmark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
                    </div>
                    <div class="card-body">
                        <h3>${p.title}</h3>
                        <p class="c-desc">${p.desc}</p>
                        <div class="card-foot">
                            <div class="cf-author"><div class="av-xs ${p.avCls}">${p.init}</div><span class="av-n">${p.author}</span></div>
                            <span class="cf-date"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${p.date}</span>
                        </div>
                    </div>`;
                grid.appendChild(el);
            });
            loaded+=2;
            lmBtn.classList.remove('loading');
            if(loaded>=extra.length){
                lmBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> All Articles Loaded';
                lmBtn.classList.add('done');
            } else {
                lmBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Load More Articles';
            }
            toast(ICONS.sparkle,'New articles loaded successfully!');
        },650);
    });

    /* === TAGS === */
    document.querySelectorAll('.tag-p').forEach(t=>t.addEventListener('click',()=>{
        sI.value=t.textContent;window.scrollTo({top:0,behavior:'smooth'});setTimeout(doSearch,600);
    }));

    /* === CARD CLICK === */
    document.addEventListener('click',e=>{
        const c=e.target.closest('.card');
        if(c&&!e.target.closest('.bm-btn')){
            toast(ICONS.doc,'Opening: '+c.querySelector('h3').textContent.slice(0,38)+'...');
        }
    });
    feat.addEventListener('click',()=>toast(ICONS.doc,'Opening featured article...'));
    document.querySelectorAll('.trend').forEach(t=>t.addEventListener('click',()=>{
        toast(ICONS.doc,t.querySelector('h4').textContent.slice(0,42)+'...');
    }));

    /* === SCROLL REVEAL === */
    const rObs=new IntersectionObserver(entries=>{
        entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');rObs.unobserve(en.target)}});
    },{threshold:.06,rootMargin:'0px 0px -35px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>rObs.observe(el));

})();
