import dayjs from "dayjs";

const calculateRefreshTokenExpiry = () => {
  const refreshTokenExpiry = dayjs().add(30, "days");
  return refreshTokenExpiry.toISOString();
};

export { calculateRefreshTokenExpiry };
