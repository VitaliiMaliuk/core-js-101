/* *******************************************************************************************
 *                                                                                           *
 * Please read the following tutorial before implementing tasks:                              *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Date_object
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date     *
 *                                                                                           *
 ******************************************************************************************* */

/**
 * Parses a rfc2822 string date representation into date value
 * For rfc2822 date specification refer to : http://tools.ietf.org/html/rfc2822#page-14
 *
 * @param {string} value
 * @return {date}
 *
 * @example:
 *    'December 17, 1995 03:24:00'    => Date()
 *    'Tue, 26 Jan 2016 13:48:02 GMT' => Date()
 *    'Sun, 17 May 1998 03:00:00 GMT+01' => Date()
 */
function parseDataFromRfc2822(value) {
  const date = new Date(value);
  if (isNaN(date)) {
    // Якщо отриманий недійсний об'єкт дати, спробуємо вручну розпарсити рядок
    const parts = value.split(' ');
    const day = parts[1].replace(',', '');
    const month = parts[2];
    const year = parts[3];
    const time = parts[4].split(':');
    const hours = time[0];
    const minutes = time[1];
    const seconds = time[2];
    const timezone = parts[5];

    // Перевіряємо, чи всі необхідні значення вдалося розпарсити
    if (day && month && year && hours && minutes && seconds && timezone) {
      return new Date(`${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${timezone}`);
    } else {
      throw new Error('Invalid date format');
    }
  } else {
    return date;
  }
}

/**
 * Parses an ISO 8601 string date representation into date value
 * For ISO 8601 date specification refer to : https://en.wikipedia.org/wiki/ISO_8601
 *
 * @param {string} value
 * @return {date}
 *
 * @example :
 *    '2016-01-19T16:07:37+00:00'    => Date()
 *    '2016-01-19T08:07:37Z' => Date()
 */
function parseDataFromIso8601(value) {
  const date = new Date(value);
  if (isNaN(date)) {
    // Якщо отриманий недійсний об'єкт дати, спробуємо вручну розпарсити рядок
    const parts = value.split('T');
    const dateString = parts[0];
    const timeString = parts[1].replace('Z', '').split('+')[0];
    const timezoneString = parts[1].split('+')[1] || '';

    // Перевіряємо, чи всі необхідні значення вдалося розпарсити
    if (dateString && timeString) {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(5, 7);
      const day = dateString.slice(8, 10);
      const hours = timeString.slice(0, 2);
      const minutes = timeString.slice(3, 5);
      const seconds = timeString.slice(6, 8);
      const timezoneHours = timezoneString.slice(0, 2);
      const timezoneMinutes = timezoneString.slice(3, 5);

      return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds) + (timezoneHours * 60 + timezoneMinutes) * 60000);
    } else {
      throw new Error('Invalid date format');
    }
  } else {
    return date;
  }
}

/**
 * Returns true if specified date is leap year and false otherwise
 * Please find algorithm here: https://en.wikipedia.org/wiki/Leap_year#Algorithm
 *
 * @param {date} date
 * @return {bool}
 *
 * @example :
 *    Date(1900,1,1)    => false
 *    Date(2000,1,1)    => true
 *    Date(2001,1,1)    => false
 *    Date(2012,1,1)    => true
 *    Date(2015,1,1)    => false
 */
function isLeapYear(date) {
  const year = date.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns the string representation of the timespan between two dates.
 * The format of output string is "HH:mm:ss.sss"
 *
 * @param {date} startDate
 * @param {date} endDate
 * @return {string}
 *
 * @example:
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,11,0,0)   => "01:00:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,30,0)       => "00:30:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,20)        => "00:00:20.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,0,250)     => "00:00:00.250"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,15,20,10,453)   => "05:20:10.453"
 */
function timeSpanToString(startDate, endDate) {
  const timeDifference = endDate - startDate;
  const hours = Math.floor(timeDifference / (3600 * 1000));
  const minutes = Math.floor((timeDifference % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);
  const milliseconds = timeDifference % 1000;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Returns the angle (in radians) between the hands of an analog clock
 * for the specified Greenwich time.
 * If you have problem with solution please read: https://en.wikipedia.org/wiki/Clock_angle_problem
 *
 * SMALL TIP: convert to radians just once, before return in order to not lost precision
 *
 * @param {date} date
 * @return {number}
 *
 * @example:
 *    Date.UTC(2016,2,5, 0, 0) => 0
 *    Date.UTC(2016,3,5, 3, 0) => Math.PI/2
 *    Date.UTC(2016,3,5,18, 0) => Math.PI
 *    Date.UTC(2016,3,5,21, 0) => Math.PI/2
 */
function angleBetweenClockHands(date) {
  const hours = date.getUTCHours();
  const mins = date.getUTCMinutes();

  let angle = Math.abs((hours % 12) * 30 + mins / 2 - mins * 6);
  while (angle > 180) {
    angle = 360 - angle;
  }

  return (angle / 180) * Math.PI;
}

module.exports = {
  parseDataFromRfc2822,
  parseDataFromIso8601,
  isLeapYear,
  timeSpanToString,
  angleBetweenClockHands,
};
