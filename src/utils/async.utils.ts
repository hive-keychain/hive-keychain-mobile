const waitForXSeconds = async (duration: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration * 1000);
  });
};

export const AsyncUtils = {waitForXSeconds};
