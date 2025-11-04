import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // 设置CORS头，允许Netlify前端访问
  res.setHeader('Access-Control-Allow-Origin', 'https://your-netlify-site.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, days, time } = req.body;

  if (!email || !days || !time || days.length === 0) {
    return res.status(400).json({ success: false, message: '请填写完整信息' });
  }

  try {
    const { data, error } = await supabase
      .from('reminders')
      .insert([{ 
        email, 
        days: JSON.stringify(days), 
        time 
      }])
      .select();

    if (error) throw error;

    console.log('提醒设置成功:', email, days, time);
    
    res.json({ 
      success: true, 
      message: '用餐提醒设置成功！您将在指定时间收到邮件提醒。'
    });
  } catch (error) {
    console.error('设置提醒失败:', error);
    res.status(500).json({ success: false, message: '设置失败，请重试' });
  }
}