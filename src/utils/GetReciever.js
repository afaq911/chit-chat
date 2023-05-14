export const GetReciever = ({ data, me }) => {
  const recieverId = data?.filter((item) => item !== me);
  return recieverId[0];
};
