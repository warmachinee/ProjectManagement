/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Fetch function
 */
export function fetchGet(url: string) {
  return new Promise(async resolve => {
    if (!/localhost/.test(window.location.href)) {
      await fetch(url)
        .then(res => res.json())
        .then(json => {
          resolve(json);
        });
    }
  });
}

export function fetchPost(props: {
  url: string;
  headers: Object;
  body: Object;
}) {
  return new Promise(async resolve => {
    const { url, headers = {}, body } = props;
    const options: any = {
      method: "POST",
      async: true,
      crossDomain: true,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        ...headers
      },
      body: JSON.stringify(body)
    };
    if (!/localhost/.test(window.location.href)) {
      await fetch(url, options)
        .then((response: any) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then(res => res.json())
        .then(json => {
          resolve(json);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  });
}

export function xhrPost(props: { url: string; headers: Object; body: Object }) {
  return new Promise(async resolve => {
    const { url, headers = {}, body } = props;
    var req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Cache-Control", "no-cache");
    req.onreadystatechange = () => {
      console.log(req);
      if (req.readyState !== 4) return;
      if (req.status >= 200 && req.status < 300) {
        if (req.responseText) {
          console.log(JSON.parse(req.responseText));
          resolve(JSON.parse(req.responseText));
        } else {
          console.log(req.responseText);
        }
      } else {
        //console.log(req.status);
      }
      if (req.status === 403) {
        //window.location.replace("/");
      }
    };
    req.send(JSON.stringify(body));
  });
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Date/Time handler function
 */

export function _dateToString(date: string | number | Date) {
  if (date) {
    let thisD, day, month, dateStr;
    thisD = new Date(date);
    day = thisD.getDate() > 9 ? thisD.getDate() : "0" + thisD.getDate();
    month = thisD.getMonth() + 1;
    dateStr = `${_getMonthFromNumber(month)} ${day}, ${thisD.getFullYear()}`;
    return dateStr;
  }
}

export function _dateToAPI(date: string | number | Date) {
  if (date) {
    let thisD, day, month, dateStr;
    thisD = new Date(date);
    day = thisD.getDate() > 9 ? thisD.getDate() : "0" + thisD.getDate();
    month = thisD.getMonth() + 1;
    dateStr = `${thisD.getFullYear()}-${_get2DigitMonth(month)}-${day}`;
    return dateStr;
  }
}

export function _getMonthFromNumber(number: number) {
  switch (number) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      console.log(number);
      return "Error Month";
  }
}

export function _get2DigitMonth(number: number) {
  switch (true) {
    case number <= 9:
      return `0${number}`;
      break;
    case number > 9:
      return number;
      break;
    default:
      return number;
      break;
  }
}

export function _getDifferenceDate(
  date1: string | number | Date,
  date2: string | number | Date
) {
  if (date1 && date2) {
    const thisDate1: any = new Date(date1);
    const thisDate2: any = new Date(date2);
    const diffTime = Math.abs(thisDate2 - thisDate1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } else {
    return "-";
  }
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Layout handler function
 */

export function _getWidth(
  width: number | string,
  minWidth: number | string | null = null
) {
  if (minWidth) {
    return { width: width, minWidth: minWidth };
  }
  return { width: width, minWidth: width };
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * String handler function
 */

export function _thousandSeperater(number: number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function _capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Number handler function
 */

export function _checkIsNaN(value: any, newValue: any) {
  const val: any = parseInt(value);
  return !isNaN(val) ? val : newValue;
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Object and Array handler function
 */

export function _totalFromArray(array: any[], key: string) {
  let total: number = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i][key];
  }
  return total;
}

export function _totalFromArrayObj(
  array: any[],
  key: string,
  obj: { key: string; value: any }
) {
  let total: number = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i][obj.key] === obj.value ? array[i][key] : 0;
  }
  return total;
}

export function _isObjectEmpty(obj: {} | { [keys: string]: any }) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Other handler function
 */

export const _onEnter = (func: () => any) => (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (event.key === "Enter") {
    func();
  }
};

export function _onLocalhost(
  localhostReturn: any | null | undefined,
  publicReturn: any | null | undefined
) {
  return /localhost/.test(window.location.href)
    ? localhostReturn
      ? localhostReturn
      : null
    : publicReturn
    ? publicReturn
    : null;
}

export function _onLocalhostFn(
  localhostFn: () => any | null | undefined,
  publicFn: () => any | null | undefined
) {
  if (/localhost/.test(window.location.href)) {
    if (localhostFn) {
      localhostFn();
    }
  } else {
    if (publicFn) {
      publicFn();
    }
  }
}
