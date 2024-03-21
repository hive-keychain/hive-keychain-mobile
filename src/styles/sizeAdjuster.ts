export const getSpaceMultiplier = (width: number, height: number) => {
  let heightMultiplier = 1;
  switch (true) {
    case height <= 600:
      heightMultiplier = 0.6;
      break;
    case height <= 800:
      heightMultiplier = 0.8;
      break;
  }
  return heightMultiplier;
};
