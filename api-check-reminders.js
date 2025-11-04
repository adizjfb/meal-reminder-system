import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const dayMap = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday'
};

export default async function handler(req, res) {
  try {
    const now = new Date();
    const currentTime = formatTime(now);
    const currentDay = dayMap[now.getDay()];
    
    console.log(`检查提醒: ${currentDay} ${currentTime}`);

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    const relevantReminders = reminders.filter(reminder => {
      const days = JSON.parse(reminder.days);
      return reminder.time === currentTime && days.includes(currentDay);
    });

    console.log(`找到 ${relevantReminders.length} 个需要发送的提醒`);

    // 这里先模拟发送邮件，后续可以集成真实邮件服务
    for (const reminder of relevantReminders) {
      console.log(`📧 [模拟]发送用餐提醒到 ${reminder.email}, 时间: ${reminder.time}`);
      // 实际使用时这里调用邮件API
    }

    res.json({ 
      success: true, 
      sent: relevantReminders.length,
      time: currentTime,
      day: currentDay
    });
  } catch (error) {
    console.error('检查提醒失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}