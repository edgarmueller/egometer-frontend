import _ from "lodash";
import moment from "moment";

export const pad = (s) => {
  if (_.isNumber(s)) {
    s = s.toString();
  }
  while (s.length < 2) {
    s = "0" + s;
  }
  return s;
};

// month in 1-based index
export function daysOfMonth(year, month) {
  const days = [];
  const lastDay = new Date(year, month, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    const d = new Date(year, month - 1, i);
    days.push(d);
  }
  return days;
}

export function daysOfWeek(date) {
  const days = [];
  date.setHours(0, 0, 0, 0);
  days.push(date);
  let i = 1;
  while (i < 7) {
    date = new Date(date.getTime());
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    days.push(date);
    i++;
  }

  return days;
}

export const findMonday = (date) => {
  if (date.getDay() === 1) {
    return date;
  }
  const d = new Date(date.getTime());
  d.setDate(date.getDate() - 1);
  return findMonday(d);
};

export function findByDate(data, desiredDate) {
  return _.find(data, ({ date }) => {
    const day = Number(date.substr(date.lastIndexOf("-") + 1, date.length));
    return day === desiredDate;
  });
}

export function lastDayOfMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function weekToDate(y, w) {
  var simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

export const getWeek = (date) => {
  const momentDate = moment(date);
  return [momentDate.isoWeekYear(), momentDate.month(), momentDate.isoWeek()];
};
