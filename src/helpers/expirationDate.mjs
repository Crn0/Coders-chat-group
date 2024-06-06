const expirationDate = (days) => {
  const current = new Date();

  const year = current.getFullYear();
  const month = current.getMonth();
  const date = Number(current.getDate());

  const expDate = date + days;

  return new Date(year, month, expDate);
};

export default expirationDate;
