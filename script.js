const tools = [
      { id: 'calculators', name: 'Calculators', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Clinical calculators (BMI, Wells, CHA2DS2‑VASc, ASCVD, etc.)', actions: ['Open suite','Add to plan'] },
      { id: 'vitals', name: 'Vital Signs', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'BP, HR, Temp—home logs & trend charts', actions: ['New entry','View trends'] },
      { id: 'diabetes', name: 'Blood Sugar / Diabetes', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Daily glucose log, A1c, hypoglycemia flags', actions: ['New entry','Education'] },
      { id: 'weight-bmi', name: 'Weight & BMI', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Weight log with BMI & RFM auto‑calc', actions: ['New entry','Open calculator'] },
      { id: 'body-comp', name: 'Body Composition', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'RFM, waist, body‑fat % (estimates)', actions: ['Open calculator'] },
      { id: 'asthma', name: 'Asthma', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Symptoms, triggers, peak flow diary', actions: ['New entry','Asthma action plan'] },
      { id: 'copd', name: 'COPD', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'CAT score, exacerbation tracker, pulse‑ox', actions: ['New entry','Education'] },
      { id: 'sleep-diary', name: 'Sleep Diary', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Bedtime, latency, awakenings, WASO', actions: ['New entry','Export PDF'] },
      { id: 'cpap-osa', name: 'CPAP / OSA', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Adherence log, Epworth, mask issues', actions: ['New entry','Import device data'] },
      { id: 'fall-risk', name: 'Fall Risks', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'STEADI screen, TUG timer', actions: ['Start screen'] },
      { id: 'smoking', name: 'Smoking', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Pack‑years, readiness to quit, NRT plan', actions: ['Start counseling','Set quit date'] },
      { id: 'alcohol', name: 'Alcohol', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'AUDIT‑C, brief intervention', actions: ['Start screen','Education'] },
      { id: 'activity', name: 'Activity Log', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Steps, minutes, METs—weekly goals', actions: ['New entry','Sync device'] },
      { id: 'pain', name: 'Pain Diary', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Location, severity, triggers, meds', actions: ['New entry','View trends'] },
      { id: 'anxiety', name: 'Anxiety', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'GAD‑7 with longitudinal tracking', actions: ['Start GAD‑7','New note'] },
      { id: 'depression', name: 'Depression', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'PHQ‑2 / PHQ‑9 with alerts', actions: ['Start PHQ‑9','New note'] },
      { id: 'bipolar', name: 'Bipolar', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'MDQ, mood chart', actions: ['Start MDQ','New entry'] },
      { id: 'seizure', name: 'Seizure Log', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Aura, duration, triggers, post‑ictal', actions: ['New entry','Export'] },
      { id: 'pulseox', name: 'Pulse Ox', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'SpO₂ spot checks & trends', actions: ['New entry','View trends'] },
      { id: 'hearing', name: 'Hearing Check', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'HHIE‑S quick screen', actions: ['Start screen'] },
      { id: 'vision', name: 'Vision Screening', tags: ['<i class="fa-regular fa-star"></i>'], desc: 'Snellen near/distance (self‑admin)', actions: ['Start screen'] },
    ];

    // --- Utilities -----------------------------------------------------------
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    function createChip(name) {
      const el = document.createElement('span');
      el.className = 'inline-flex items-center gap-2 rounded-full border border-gray-300/70 dark:border-gray-700 px-2.5 py-1 text-xs';
      el.textContent = name;
      return el;
    }

    function cardTemplate(t) {
      const tags = t.tags.map(tag => `<span class="text-[10px] tracking-wide uppercase bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5">${tag}</span>`).join(' ');
      const actions = t.actions.map(a => `<button class="action-btn" data-action="${a}" data-target="${t.id}">${a}</button>`).join('');
      return `
      <article class="group rounded-xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-semibold mb-1">${t.name}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">${t.desc}</p>
          </div>
          <div lass="flex flex-wrap gap-1 self-start">${t.tags}</div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <a href="Calculator.html" class="bg-blue-600 p-2 text-white dark:bg-gray-950 dark:border-gray-900 border border-gray-300 mb-2 rounded-sm text-sm">Open it!</a>
        </div>
      </article>`;
    }

    function renderGrid(data) {
      const grid = $('#grid');
      grid.innerHTML = data.map(cardTemplate).join('');
      $('#empty').classList.toggle('hidden', data.length !== 0);
    }

    // --- Search & filter logic ----------------------------------------------
    let activeTags = new Set();

    function applyFilters() {
      const q = $('#search').value.trim().toLowerCase();
      const filtered = tools.filter(t => {
        const matchesQuery = !q || [t.name, t.desc, t.tags.join(' ')].join(' ').toLowerCase().includes(q);
        const matchesTags = activeTags.size === 0 || t.tags.some(tag => activeTags.has(tag));
        return matchesQuery && matchesTags;
      });
      renderGrid(filtered);
    }

    $$('#clearFilters').forEach(btn => btn.addEventListener('click', () => {
      $('#search').value = '';
      activeTags.clear();
      $$('.chip').forEach(c => c.classList.remove('chip--active'));
      applyFilters();
    }));

    $('#search').addEventListener('input', applyFilters);

    $$('.chip').forEach(chip => {
      chip.classList.add('rounded-full','border','border-gray-300/70','dark:border-gray-700','px-3','py-1.5','hover:bg-gray-50','dark:hover:bg-gray-800');
      chip.addEventListener('click', () => {
        const tag = chip.dataset.tag;
        if (activeTags.has(tag)) { activeTags.delete(tag); chip.classList.remove('chip--active'); }
        else { activeTags.add(tag); chip.classList.add('chip--active'); }
        applyFilters();
      });
    });

    // --- Actions / modal -----------------------------------------------------
    function openModal(title, subtitle, bodyHtml) {
      $('#modalTitle').textContent = title;
      $('#modalSubtitle').textContent = subtitle || '';
      $('#modalBody').innerHTML = bodyHtml;
      $('#modal').showModal();
    }
    $('#modalClose').addEventListener('click', () => $('#modal').close());
    $('#modal').addEventListener('click', (e) => {
      const dialog = e.currentTarget;
      const rect = dialog.getBoundingClientRect();
      const clickedIn = rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
      if (!clickedIn) dialog.close();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.action-btn');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.target;
      const tool = tools.find(t => t.id === id);

      // Placeholder bodies – integrate with your APIs/routes
      const bodies = {
        'New entry': `<p>Create a new entry for <strong>${tool.name}</strong>. Wire this button to your POST <code>/api/${id}/entries</code>.</p>`,
        'View trends': `<p>Show charts for <strong>${tool.name}</strong>. Fetch from <code>/api/${id}/entries?range=90d</code> and render with your charting lib.</p>`,
        'Open suite': `<p>Open the full calculators suite. Route to <code>/tools/calculators</code> or launch a drawer.</p>`,
        'Add to plan': `<p>Add <strong>${tool.name}</strong> to a patient plan. Connect to <code>/api/care-plans</code>.</p>`,
        'Education': `<p>Display patient education for <strong>${tool.name}</strong>. Source from your CMS (e.g., Strapi/Contentful) via <code>/api/cms?slug=${id}</code>.</p>`,
        'Open calculator': `<p>Launch calculator modal or route (e.g., BMI, RFM). Consider a <em>serverless function</em> to keep formulas in one place.</p>`,
        'Asthma action plan': `<p>Open editable action plan template with signature fields. Save to PDF.</p>`,
        'Import device data': `<p>Connect to device vendor API (ResMed, Philips) or allow CSV upload.</p>`,
        'Start screen': `<p>Start a validated screener workflow (e.g., AUDIT‑C/STEADI/PHQ‑9). Use versioned forms and store scoring logic centrally.</p>`,
        'Start counseling': `<p>Open a 5A’s & readiness‑to‑quit flow with options to e‑prescribe NRT (via eRx API).</p>`,
        'Set quit date': `<p>Calendar picker → reminders (SMS/Email) via your comms service.</p>`,
        'Export PDF': `<p>Render selected entries as a signed PDF for the chart.</p>`,
        'Sync device': `<p>OAuth connect to Apple Health / Google Fit / Fitbit, then set nightly sync jobs.</p>`,
        'New note': `<p>Insert scored results into provider note with smart phrases.</p>`
      };

      openModal(action + ' • ' + tool.name, tool.desc, bodies[action] || '<p>Action placeholder.</p>');
    });

    
   
    // --- Init ----------------------------------------------------------------
    renderGrid(tools);
    $('#year').textContent = new Date().getFullYear();
