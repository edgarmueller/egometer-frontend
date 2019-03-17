export const pad = s => {
  while (s.length < 2) {
    s = "0" + s;
  }
  return s;
};

export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

const findMonday = date => {
  if (date.getDay() === 1) {
    return date;
  }
  const d = new Date(date.getTime());
  d.setDate(date.getDate() - 1);
  return findMonday(d);
};

export function daysOfWeek(d) {
  let week = [];
  const date = findMonday(d);
  week.push(date);

  for (let i = 1; i <= 7; i++) {
    //let first = date.getDate() - date.getDay() + i;
    const d = new Date(date.getTime());
    d.setDate(date.getDate() + i);
    week.push(d);
  }

  return week;
}
