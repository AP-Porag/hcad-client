export const formatCurrency = (value) => {
    if (!value) return "-";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatNumber = (value) => {
    if (!value) return "-";

    return new Intl.NumberFormat("en-US").format(value);
};


export const formatPropertyAddress=(address = "") =>{

    if (!address) return "-";

    const parts = address.split(" ");

    const zip = parts.pop();

    const city = parts.pop();

    const street = parts.join(" ");

    return {
        street,
        city,
        zip,
    };
}
