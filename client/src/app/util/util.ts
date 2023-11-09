// source: https://stackoverflow.com/questions/51109559/get-cookie-with-react
const getCookie = (key: string) => {
  const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
};

export { getCookie };
