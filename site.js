(() => {
  const nav = document.querySelector('[data-nav-links]');
  const navToggle = document.querySelector('[data-menu-toggle]');
  const menuButtons = [...document.querySelectorAll('[data-menu]')];
  const closeMenus = () => menuButtons.forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
  });
  menuButtons.forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    closeMenus();
    button.setAttribute('aria-expanded', String(open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-group')) closeMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const active = menuButtons.find(button => button.getAttribute('aria-expanded') === 'true');
    closeMenus();
    if (active) active.focus();
    else if (navToggle?.getAttribute('aria-expanded') === 'true') {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
      navToggle.focus();
    }
  });
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('open', open);
    if (!open) closeMenus();
  });

  // Local, consent-aware event hooks only. No analytics vendor or network request is configured.
  const track = (name, detail = {}) => {
    window.dispatchEvent(new CustomEvent('ownerstamp:event', { detail: { name, ...detail } }));
  };
  if (document.body.dataset.page) track('landing_view', { page: document.body.dataset.page });
  document.querySelectorAll('[data-event]').forEach((el) => el.addEventListener('click', () => track(el.dataset.event)));

  // Backend handoff: no network, credential storage, fabricated success, or public status notice.
  // The receiving developer can subscribe to ownerstamp:form-ready and implement submission.
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const feedback = form.querySelector('[data-form-error]');
      const fields = [...form.querySelectorAll('input,select,textarea')];
      fields.forEach(field => field.setAttribute('aria-invalid', String(!field.validity.valid)));
      const firstInvalid = fields.find(field => !field.validity.valid);
      if (firstInvalid) {
        firstInvalid.focus();
        feedback.hidden = false;
        const label = form.querySelector(`label[for="${firstInvalid.id}"]`);
        const name = label?.textContent.replace('*','').trim() || 'the highlighted field';
        feedback.textContent = firstInvalid.validity.typeMismatch ? 'Please enter a valid email address.' : `Please check ${name.toLowerCase()}.`;
        feedback.setAttribute('role', 'alert');
        firstInvalid.setAttribute('aria-describedby', feedback.id || `${form.dataset.form}-error`);
        feedback.id ||= `${form.dataset.form}-error`;
        return;
      }
      feedback.hidden = true;
      feedback.textContent = '';
      form.dispatchEvent(new CustomEvent('ownerstamp:form-ready', { bubbles: true, detail: { formName: form.dataset.form, form } }));
    });
    form.addEventListener('input', event => {
      if (event.target.matches('input,select,textarea') && event.target.validity.valid) event.target.removeAttribute('aria-invalid');
    });
  });
  document.querySelectorAll('[data-password-toggle]').forEach(button => button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(show));
    button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  }));
  document.querySelectorAll('[data-ledger]').forEach(ledger => {
    const tabs = [...ledger.querySelectorAll('[data-ledger-tab]')];
    const activate = tab => {
      tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
      ledger.querySelectorAll('[data-ledger-panel]').forEach(panel => panel.hidden = panel.dataset.ledgerPanel !== tab.dataset.ledgerTab);
      window.ScrollTrigger?.refresh();
    };
    tabs.forEach((tab,index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', event => {
        const next = {ArrowRight:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1}[event.key];
        if (next === undefined) return;
        event.preventDefault();activate(tabs[next]);tabs[next].focus();
      });
    });
    const samples = [
      {name:'PO-Assist-07',owner:'Maya Chen · unconfirmed',principal:'demo-guid-001',role:'demo-po-assist',scope:'Read purchase order status',source:'sample-v3 / PO-Assist-07',review:'14 October 2026'},
      {name:'Support-Summary-11',owner:'Unassigned',principal:'demo-guid-003',role:'shared-support-reader',scope:'Read support cases',source:'sample-v3 / Support-Summary-11',review:'No attestation on file'},
      {name:'Data-Quality-09',owner:'Unassigned',principal:'demo-guid-007',role:'warehouse-quality-view',scope:'Read quality results',source:'sample-v1 / Data-Quality-09',review:'No owner attestation'}
    ];
    const updateFields = (panel, values) => [...panel.querySelectorAll('.record-field strong')].forEach((field,i) => field.textContent = values[i]);
    ledger.querySelectorAll('[data-ledger-record]').forEach(button => button.addEventListener('click', () => {
      const sample = samples[Number(button.dataset.ledgerRecord)];
      ledger.querySelectorAll('[data-ledger-record]').forEach(item => { item.classList.toggle('selected', item===button); item.setAttribute('aria-pressed',String(item===button)); });
      ledger.querySelector('[data-ledger-name]').textContent = sample.name;
      updateFields(ledger.querySelector('[data-ledger-panel="ownership"]'),[sample.owner,'Platform engineering · sample',sample.owner==='Unassigned'?'Unattributed · human review required':'Inferred · human review required']);
      updateFields(ledger.querySelector('[data-ledger-panel="authority"]'),[sample.principal,sample.role,sample.scope]);
      updateFields(ledger.querySelector('[data-ledger-panel="evidence"]'),[sample.source,sample.review,sample.owner==='Unassigned'?'No confirmed human sponsor':'Sponsor has not confirmed']);
    }));
  });

  const tablist = document.querySelector('[data-demo-tabs]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = [...document.querySelectorAll('[data-demo-panel]')];
    const activate = (tab, focus = false) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => { panel.hidden = panel.dataset.demoPanel !== tab.dataset.demoTab; });
      track('demo_open', { tab: tab.dataset.demoTab });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault(); activate(tabs[next], true);
      });
    });
    activate(tabs[0]);
  }

  const records = [
    {id:'PO-Assist-07',env:'Production',owner:'Maya Chen · unconfirmed',state:'Ownerless',principal:'demo-guid-001',role:'arn:aws:iam::000000000000:role/demo-po-assist',tool:'Purchase order lookup',scope:'Read purchase order status',date:'07 Oct 2026',source:'Approved agent manifest · sample-v3',confidence:'Inferred',attest:'Review due 14 Oct 2026 · unconfirmed'},
    {id:'Invoice-Triage-02',env:'Production',owner:'Jordan Lee',state:'Attested',principal:'demo-guid-002',role:'arn:aws:iam::000000000000:role/demo-invoice-read',tool:'Invoice archive',scope:'Read invoice metadata',date:'06 Oct 2026',source:'AWS IAM export · sample-12',confidence:'Source-linked',attest:'Review due 30 Nov 2026'},
    {id:'Support-Summary-11',env:'Staging',owner:'Unassigned',state:'Ownerless',principal:'demo-guid-003',role:'shared-support-reader',tool:'Case summary API',scope:'Read support cases',date:'05 Oct 2026',source:'Runtime manifest · sample-v3',confidence:'Unattributed',attest:'No attestation on file'},
    {id:'Claims-Review-04',env:'Production',owner:'Ari Patel',state:'Needs review',principal:'demo-guid-004',role:'claims-review-role',tool:'Claims lookup',scope:'Read claim status',date:'04 Oct 2026',source:'Entra export · sample-08',confidence:'Inferred',attest:'Scope changed 02 Oct'},
    {id:'Procurement-Scout-01',env:'Development',owner:'Maya Chen',state:'Attested',principal:'demo-guid-005',role:'procurement-scout-read',tool:'Vendor directory',scope:'Read vendor profile',date:'03 Oct 2026',source:'Agent manifest · sample-v2',confidence:'Source-linked',attest:'Review due 01 Dec 2026'},
    {id:'Ops-Runbook-03',env:'Production',owner:'Sam Rivera',state:'Expired',principal:'demo-guid-006',role:'ops-runbook-reader',tool:'Runbook search',scope:'Read runbook index',date:'02 Oct 2026',source:'Access review · sample-04',confidence:'Source-linked',attest:'Expired 01 Oct 2026'},
    {id:'Data-Quality-09',env:'Staging',owner:'Unassigned',state:'Ownerless',principal:'demo-guid-007',role:'warehouse-quality-view',tool:'Quality dashboard',scope:'Read quality results',date:'30 Sep 2026',source:'Runtime export · sample-v1',confidence:'Unattributed',attest:'No owner attestation'},
    {id:'Knowledge-Guide-05',env:'Production',owner:'Nina Brooks',state:'Attested',principal:'demo-guid-008',role:'knowledge-index-reader',tool:'Policy search',scope:'Read published policies',date:'28 Sep 2026',source:'Entra export · sample-07',confidence:'Source-linked',attest:'Review due 15 Dec 2026'}
  ];
  const state = {selected:0, filter:'all', assignments:new Map(), attestationExpired:false, tickets:new Set()};
  const list = document.querySelector('[data-record-list]');
  const detail = document.querySelector('[data-record-detail]');
  const edgeList = document.querySelector('[data-edge-list]');
  const filter = document.querySelector('[data-owner-filter]');
  const demoFeedback = document.querySelector('[data-demo-feedback]');
  const mark = document.querySelector('[data-sample-workspace]');
  const renderRecordList = () => {
    if (!list) return;
    const shown = records.map((r,i)=>({r,i})).filter(({r,i})=>state.filter==='all'||(r.state==='Ownerless'&&!state.assignments.has(i)));
    list.replaceChildren();
    shown.forEach(({r,i})=>{
      const button=document.createElement('button');button.type='button';button.className='demo-item';button.setAttribute('aria-pressed',String(i===state.selected));button.dataset.recordIndex=String(i);
      const status=i===0&&state.attestationExpired?'Expired':state.assignments.has(i)?'Attested':r.state;
      const owner=state.assignments.get(i)||r.owner;
      const text=document.createElement('span');text.innerHTML=`<b>${r.id}</b><small>${r.env} · ${owner}</small>`;
      const badge=document.createElement('span');badge.className=`badge ${status==='Attested'?'':'review'}`;badge.textContent=status;
      button.append(text,badge);button.addEventListener('click',()=>{state.selected=i;renderRecordList();renderDetail();renderEdges();list.querySelector(`[data-record-index="${i}"]`)?.focus({preventScroll:true})});list.append(button);
    });
    const count=document.querySelector('[data-record-count]');if(count)count.textContent=`${shown.length} of ${records.length} sample records`;
  };
  const renderDetail = () => {
    if (!detail) return;
    const r=records[state.selected];
    const owner=state.assignments.get(state.selected)||r.owner;
    const status=state.selected===0&&state.attestationExpired?'Expired':state.assignments.has(state.selected)?'Attested':r.state;
    const attestation=state.selected===0&&state.attestationExpired?'Expired 07 Oct 2026 · sample state':state.assignments.has(state.selected)?'Confirmed 07 Oct · review due 14 Oct · sample':r.attest;
    detail.innerHTML=`<h2>${r.id}</h2><p>${r.env} · Fictional Northstar Components workspace</p><div class="demo-fields"><div class="mini-field"><small>Human sponsor</small><b>${owner}</b></div><div class="mini-field"><small>Review state</small><b>${status}</b></div><div class="mini-field"><small>Entra principal</small><b>${r.principal}</b></div><div class="mini-field"><small>Credential / role reference</small><b>${r.role}</b></div><div class="mini-field"><small>Connected tool</small><b>${r.tool}</b></div><div class="mini-field"><small>Declared scope</small><b>${r.scope}</b></div><div class="mini-field"><small>Last sample observation</small><b>${r.date}</b></div><div class="mini-field"><small>Owner attestation</small><b>${attestation}</b></div></div><div class="demo-source"><strong>Source and confidence</strong><ul><li>${r.source}</li><li>${r.confidence} relationship · preserve the original source confidence</li><li>Sample principal IDs are fictional; no provider is contacted</li></ul></div><div class="demo-actions"><button class="btn secondary" type="button" data-action="assign">Assign sample sponsor</button><button class="btn" type="button" data-action="revoke">Draft revocation ticket</button><button class="btn secondary" type="button" data-reset-demo>Reset demo</button></div><p class="fine">Actions change only this synthetic workspace; they are not saved, sent, or applied to access.</p>`;
    detail.querySelector('[data-action="assign"]').addEventListener('click',()=>{
      const selected=state.selected;
      const dialog=document.createElement('dialog');dialog.className='confirmation-dialog';
      dialog.setAttribute('aria-labelledby','confirmation-heading');
      dialog.innerHTML=`<p class="eyebrow">Synthetic workspace / local action</p><h2 id="confirmation-heading">Confirm a sample sponsor.</h2><p>${r.id} · ${r.scope}. This changes the fictional ownership state only.</p><label for="sample-sponsor">Sample sponsor</label><select id="sample-sponsor"><option>Maya Chen</option><option>Jordan Lee</option><option>Sam Rivera</option></select><div class="actions"><button class="btn" type="button" data-confirm>Confirm sample sponsor</button><button class="btn secondary" type="button" data-cancel>Cancel</button></div>`;
      document.body.append(dialog);dialog.showModal();
      dialog.querySelector('[data-cancel]').addEventListener('click',()=>dialog.close());
      dialog.addEventListener('close',()=>{dialog.remove();detail.querySelector('[data-action="assign"]')?.focus({preventScroll:true})},{once:true});
      dialog.querySelector('[data-confirm]').addEventListener('click',()=>{
        const name=dialog.querySelector('select').value;
        state.assignments.set(selected,`${name} · sample assignment`);
        if(selected===0)state.attestationExpired=false;
        dialog.close();renderRecordList();renderDetail();renderEdges();
        demoFeedback.hidden=false;demoFeedback.textContent=`Synthetic state only: ${name} is the sample sponsor for ${r.id}. Nothing was recorded or sent.`;
      });
    });
    detail.querySelector('[data-action="revoke"]').addEventListener('click',()=>{state.tickets.add(state.selected);demoFeedback.hidden=false;demoFeedback.textContent=`Synthetic draft for ${r.id}. No revocation was requested or executed.`;renderEdges();track('demo_complete',{action:'draft-revocation'})});
    detail.querySelector('[data-reset-demo]').addEventListener('click',resetDemo);
  };
  const renderEdges=()=>{
    if(!edgeList)return;
    const r=records[state.selected];
    const owner=state.assignments.get(state.selected)||r.owner;
    edgeList.innerHTML=`<li><b>Agent deployment</b> ${r.id} <span class="tag gray">${r.confidence}</span></li><li>→ Human sponsor <b>${owner}</b> <span class="tag ${owner==='Unassigned'?'warn':'gray'}">${owner==='Unassigned'?'Unattributed':'Sample relationship'}</span></li><li>→ Principal <b>${r.principal}</b> <span class="tag gray">Source-linked sample</span></li><li>→ Credential / role <b>${r.role}</b> <span class="tag warn">Scope needs review</span></li><li>→ Tool and scope <b>${r.tool}</b> · ${r.scope}</li>`;
    const evidence=document.querySelector('#panel-evidence .product-preview');
    if(evidence){
      evidence.querySelector('.preview-head strong').textContent=`${r.id} · sample evidence record`;
      const fields=evidence.querySelectorAll('.mini-field b');
      fields[0].textContent=r.source;fields[1].textContent=`${r.principal} · ${r.role}`;
      fields[2].textContent=`${r.confidence} · sample source references`;
      fields[3].textContent=state.assignments.has(state.selected)?'Sample ownership confirmed; source completeness still needs review':r.state==='Attested'?'Source completeness remains scoped':owner==='Unassigned'?'Human sponsor is unassigned':'Human sponsor needs confirmation';
      fields[4].textContent=state.tickets.has(state.selected)?`Proposed draft for ${r.id} · local only`:'No ticket drafted';
    }
    document.querySelectorAll('#panel-attestations .relationship').forEach((row,index)=>{
      const sample=records[index];
      const expired=index===0&&state.attestationExpired;
      row.querySelector('b').textContent=`${sample.id} · ${state.assignments.get(index)||sample.owner}`;
      const badge=row.querySelector('.tag');
      badge.textContent=expired?'Expired 07 Oct 2026 · sample state':state.assignments.has(index)?'Confirmed 07 Oct · review due 14 Oct · sample':`${sample.attest} · synthetic sample`;
      badge.className=!expired&&(state.assignments.has(index)||sample.state==='Attested')?'tag green':'tag warn';
    });
  };
  const resetDemo=()=>{state.selected=0;state.filter='all';state.assignments.clear();state.attestationExpired=false;state.tickets.clear();if(filter)filter.value='all';if(demoFeedback){demoFeedback.hidden=true;demoFeedback.textContent=''}renderRecordList();renderDetail();renderEdges();};
  document.querySelector('[data-expire-attestation]')?.addEventListener('click',()=>{state.attestationExpired=true;if(demoFeedback){demoFeedback.hidden=false;demoFeedback.textContent='Demo state only: this sample attestation is now shown as expired. Nothing was recorded or sent.'}renderRecordList();renderDetail();renderEdges();track('demo_complete',{action:'expire-sample-attestation'})});
  filter?.addEventListener('change',()=>{state.filter=filter.value;renderRecordList()});
  document.querySelectorAll('[data-reset-demo]').forEach((button)=>button.addEventListener('click',resetDemo));
  renderRecordList();renderDetail();renderEdges();
})();
