// Lesson questions are bundled with this function, outside the public dist folder.
const script = require('../private/directions.cjs');
const authUrl = 'https://vmwknzrywcyajjqdwsmj.supabase.co/auth/v1/user';
const publishableKey = 'sb_publishable_aWalK7iNwm_PwmfTi_2hLA_HLNRYw5a';
const teacherId = 'eb3a0fce-6c14-48df-bdd5-0b1bcdbee4c9';
const reply = (statusCode, body) => ({statusCode, headers:{
  'Content-Type':'application/json', 'Cache-Control':'private, no-store',
  'X-Content-Type-Options':'nosniff',
}, body:JSON.stringify(body)});
exports.handler = async event => {
  if(event.httpMethod !== 'GET') return reply(405,{error:'Method not allowed'});
  const authorization = event.headers?.authorization || event.headers?.Authorization || '';
  if(!/^Bearer \S+$/.test(authorization)) return reply(401,{error:'Teacher sign-in required'});
  try {
    const response = await fetch(authUrl, {headers:{apikey:publishableKey,Authorization:authorization},signal:AbortSignal.timeout(10000)});
    if(!response.ok) return reply(response.status===401||response.status===403?401:503,{error:'Could not verify teacher sign-in'});
    const user = await response.json();
    if(user.id !== teacherId) return reply(403,{error:'Teacher access required'});
    return reply(200,{script});
  } catch {
    return reply(503,{error:'Teacher verification unavailable. Please retry.'});
  }
};
