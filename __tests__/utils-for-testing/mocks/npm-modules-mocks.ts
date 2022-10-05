export default {
  date: {
    now: (dateNow: number) => (Date.now = jest.fn().mockReturnValue(dateNow)),
  },
};
