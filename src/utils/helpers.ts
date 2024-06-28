export const debounce = <T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
};
