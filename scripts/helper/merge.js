const mergeRecursive = (leftObject, rightObj) => {
  const obj1 = leftObject;
  const obj2 = rightObj;
  Object.keys(obj2).forEach((p) => {
    try {
      if (obj2[p].constructor === Object) {
        obj1[p] = mergeRecursive(obj1[p], obj2[p]);
      } else if (Array.isArray(obj1[p]) && Array.isArray(obj2[p])) {
        obj1[p] = obj1[p].concat(obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      obj1[p] = obj2[p];
    }
  });
  return obj1;
};

module.exports = mergeRecursive;
