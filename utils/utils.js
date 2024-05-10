export const normalizeString = (originalString) => {
    return originalString
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[đĐ]/g, "d");
};

