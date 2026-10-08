// Publishable configuration only. Access to records is enforced by Supabase RLS.
window.ResultsAPI = (() => {
  const url = 'https://vmwknzrywcyajjqdwsmj.supabase.co';
  const key = 'sb_publishable_aWalK7iNwm_PwmfTi_2hLA_HLNRYw5a';
  const teacherId = 'eb3a0fce-6c14-48df-bdd5-0b1bcdbee4c9';
  async function request(path, options = {}, token) {
    const response = await fetch(url + path, {
      ...options,
      headers: { apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json', ...options.headers },
      signal: AbortSignal.timeout(20000),
    });
    const data = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error('The request could not be completed.');
      error.status = response.status;
      error.code = data?.code;
      throw error;
    }
    return data;
  }
  return {
    teacherId,
    async submit(record) {
      try {
        await request('/rest/v1/student_results', {
          method: 'POST', body: JSON.stringify(record), headers: { Prefer: 'return=minimal' },
        });
      } catch (error) {
        // A retry after a lost response uses the same primary key.
        if (error.status !== 409 || error.code !== '23505') throw error;
      }
    },
    signIn(email, password) {
      return request('/auth/v1/token?grant_type=password', {
        method: 'POST', body: JSON.stringify({ email, password }),
      });
    },
    refresh(refreshToken) {
      return request('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }),
      });
    },
    signOut(token) { return request('/auth/v1/logout', { method: 'POST' }, token); },
    async results(token) {
      const rows = [];
      for (let offset = 0; ; offset += 500) {
        const batch = await request(`/rest/v1/student_results?select=student_name,class_section,game,exercise,score,total,completed_at&order=completed_at.asc,id.asc&limit=500&offset=${offset}`, {}, token);
        rows.push(...batch);
        if (batch.length < 500) return rows;
      }
    },
  };
})();

