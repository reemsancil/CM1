(() => {
  const login = document.querySelector('#teacher-login');
  const view = document.querySelector('#teacher-results');
  const status = document.querySelector('#teacher-status');
  const sections = document.querySelector('#section-results');
  const download = document.querySelector('#download-csv');
  const refresh = document.querySelector('#refresh-results');
  let session = null; // Kept in memory; closing/reloading this page requires sign-in.
  let rows = [];
  let generation = 0;
  const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
  const dateFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh', dateStyle: 'medium', timeStyle: 'medium',
  });
  function clear() {
    generation++;
    session = null;
    rows = [];
    sections.replaceChildren();
    download.disabled = true;
    view.hidden = true;
    login.hidden = false;
    login.reset();
  }
  function render() {
    sections.replaceChildren();
    for (const section of ['CM1 A', 'CM1 D']) {
      const group = rows.filter(row => row.class_section === section);
      const heading = document.createElement('h2');
      heading.textContent = `${section} (${group.length} submissions)`;
      sections.append(heading);
      if (!group.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No submissions yet.';
        sections.append(empty);
        continue;
      }
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      const table = document.createElement('table');
      const caption = document.createElement('caption');
      caption.textContent = `${section} student results`;
      table.append(caption);
      const head = document.createElement('thead');
      const header = document.createElement('tr');
      for (const label of ['Student name', 'Game', 'Exercise', 'Score', 'Completed (UTC+03:00)']) {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = label;
        header.append(th);
      }
      head.append(header);
      table.append(head);
      const body = document.createElement('tbody');
      for (const row of group) {
        const tr = document.createElement('tr');
        for (const value of [row.student_name, row.game, row.exercise, `${row.score} / ${row.total}`, dateFormat.format(new Date(row.completed_at))]) {
          const td = document.createElement('td');
          td.textContent = value;
          tr.append(td);
        }
        body.append(tr);
      }
      table.append(body);
      wrap.append(table);
      sections.append(wrap);
    }
    download.disabled = !rows.length;
  }
  async function load() {
    if (!session) return;
    const run = ++generation;
    refresh.disabled = true;
    download.disabled = true;
    status.textContent = 'Loading results…';
    try {
      if (session.expires_at <= Date.now() / 1000 + 60) {
        const renewed = await ResultsAPI.refresh(session.refresh_token);
        if (run !== generation) return;
        if (renewed.user?.id !== ResultsAPI.teacherId) throw Object.assign(new Error(), { status: 401 });
        session = { ...renewed, expires_at: Date.now() / 1000 + renewed.expires_in };
      }
      const loaded = await ResultsAPI.results(session.access_token);
      if (run !== generation) return;
      rows = loaded.filter(row => ['CM1 A', 'CM1 D'].includes(row.class_section)).sort((a, b) => collator.compare(a.class_section, b.class_section) || collator.compare(a.student_name, b.student_name) || a.completed_at.localeCompare(b.completed_at));
      render();
      status.textContent = `${rows.length} submissions loaded.`;
    } catch (error) {
      if (run !== generation) return;
      if (error.status === 401 || error.status === 403) {
        clear();
        status.textContent = 'Your session ended or access was denied. Please sign in again.';
      } else {
        rows = [];
        sections.replaceChildren();
        status.textContent = 'Could not load results. Check your connection and press Refresh results.';
      }
    } finally {
      refresh.disabled = false;
    }
  }
  login.addEventListener('submit', async event => {
    event.preventDefault();
    const button = login.querySelector('button');
    button.disabled = true;
    status.textContent = 'Signing in…';
    try {
      const auth = await ResultsAPI.signIn(document.querySelector('#teacher-email').value.trim(), document.querySelector('#teacher-password').value);
      if (auth.user?.id !== ResultsAPI.teacherId) {
        await ResultsAPI.signOut(auth.access_token).catch(() => {});
        throw new Error('Unauthorized account');
      }
      session = { ...auth, expires_at: Date.now() / 1000 + auth.expires_in };
      login.reset();
      login.hidden = true;
      view.hidden = false;
      await load();
    } catch {
      status.textContent = 'Sign-in failed. Check your teacher email and password, then try again.';
      document.querySelector('#teacher-password').value = '';
    } finally {
      button.disabled = false;
    }
  });
  refresh.addEventListener('click', load);
  document.querySelector('#sign-out').addEventListener('click', () => {
    const token = session?.access_token;
    clear();
    status.textContent = 'Signed out.';
    if (token) ResultsAPI.signOut(token).catch(() => {});
    document.querySelector('#teacher-email').focus();
  });
  function cell(value) {
    let text = String(value);
    if (/^[\s\uFEFF]*[=+@-]/u.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }
  download.addEventListener('click', () => {
    if (!session || !rows.length) return;
    const lines = [['Student name', 'Class section', 'Game', 'Exercise', 'Score', 'Total', 'Completed at (UTC)'],
      ...rows.map(row => [row.student_name, row.class_section, row.game, row.exercise, row.score, row.total, new Date(row.completed_at).toISOString()])];
    const blob = new Blob(['\uFEFF' + lines.map(line => line.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cm1-student-results.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();

