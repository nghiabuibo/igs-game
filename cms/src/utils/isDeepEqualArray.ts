
const isObject = (object) => {
    return object != null && typeof object === "object";
};

const isDeepEqual = (object1, object2) => {
    const objKeys1 = Object.keys(object1);
    const objKeys2 = Object.keys(object2);

    if (objKeys1.length !== objKeys2.length) return false;

    for (var key of objKeys1) {
        const value1 = object1[key];
        const value2 = object2[key];

        const isObjects = isObject(value1) && isObject(value2);
        if ((isObjects && !isDeepEqual(value1, value2)) ||
        (!isObjects && value1 !== value2)
        ) {
            return false;
        }
    }
    return true;
};

function isDeepEqualArray(arr1, arr2) {
    // Check if both arguments are arrays
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false;
    }
    
    // Check if the arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }
    
    
    

    // Iterate through each element in the arrays
    for (let i = 0; i < arr1.length; i++) {
        const element1 = arr1[i];
        const element2 = arr2[i];

        // Check if the elements are objects and recursively compare them
        if (!isDeepEqual(element1, element2)) return false
    }

    // If all elements are equal, arrays are deep equal
    return true;
}

export default isDeepEqualArray