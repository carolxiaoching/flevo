// 取得時間
export const getTime = (time: string): string => {
  const newTime = new Date(time);
  const year = newTime.getFullYear();
  const month = newTime.getMonth() < 9 ? `0${newTime.getMonth() + 1}` : newTime.getMonth() + 1;
  const date = newTime.getDate() < 9 ? `0${newTime.getDate()}` : newTime.getDate();
  return `${year}/${month}/${date}`;
};

// 差幾天
export function getDaysDifference(targetDateStr: string): number {
  const targetDate = new Date(targetDateStr);
  const today = new Date();

  // 設定時間為 00:00:00 避免影響計算
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays : 0; // 避免未來日期返回負數
}
