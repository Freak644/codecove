export const debouncerGlob = (func, delay = 300) => {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {
            func(...args);
        }, delay);

    };
};