function vnToEn(str) {
    str = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")

    return str
}

export default vnToEn