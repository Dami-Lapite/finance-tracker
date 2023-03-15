import { isEmpty } from "lodash";

export function parseCurrency(valueString) {
  if (isNaN(parseFloat(valueString))) {
    return "";
  }
  let parsedValue = "$";

  let cents = "";

  let RegexString = /\.\d*/g;
  if (valueString.search(RegexString) > -1) {
    let splitValue = valueString.split(".");
    valueString = splitValue[0];
    cents = splitValue[1];
  }
  let thousandths = "";
  while (valueString.length > 3) {
    thousandths = "," + valueString.slice(-3) + thousandths;
    valueString = valueString.substring(0, valueString.length - 3);
  }
  parsedValue += valueString;
  if (!isEmpty(thousandths)) {
    parsedValue += thousandths;
  }
  if (!isEmpty(cents)) {
    parsedValue += "." + cents;
  } else {
    parsedValue += "." + "00";
  }
  return parsedValue;
}
