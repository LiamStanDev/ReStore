// source: https://stackoverflow.com/questions/51109559/get-cookie-with-react
const getCookie = (key: string) => {
  const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
};

const currencyFormat = (amount: number): string => {
  return "$" + (amount / 100).toFixed(2);
};

export { getCookie, currencyFormat };
