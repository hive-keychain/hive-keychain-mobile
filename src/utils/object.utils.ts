const isPureObject = (obj: any) => {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj === 'object' &&
    !Array.isArray(obj)
  );
};

const diffObjects = (obj1: any, obj2: any) => {
  const result: any = {};

  for (const key in obj1) {
    if (!(key in obj2)) {
      result[key] = {from: obj1[key], to: undefined};
    } else if (
      typeof obj1[key] === 'object' &&
      obj1[key] !== null &&
      typeof obj2[key] === 'object' &&
      obj2[key] !== null
    ) {
      const nestedDiff = diffObjects(obj1[key], obj2[key]);
      if (Object.keys(nestedDiff).length > 0) {
        result[key] = nestedDiff;
      }
    } else if (obj1[key] !== obj2[key]) {
      result[key] = {from: obj1[key], to: obj2[key]};
    }
  }

  for (const key in obj2) {
    if (!(key in obj1)) {
      result[key] = {from: undefined, to: obj2[key]};
    }
  }

  return result;
};

export const ObjectUtils = {
  isPureObject,
  diffObjects,
};
