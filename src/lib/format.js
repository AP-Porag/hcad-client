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

export const formatCompactNumber = (
    value
) => {

    if (!value) return "0";

    const number = Number(value);

    if (number >= 1_000_000_000) {
        return (
            (
                number / 1_000_000_000
            ).toFixed(1) + "B"
        );
    }

    if (number >= 1_000_000) {
        return (
            (
                number / 1_000_000
            ).toFixed(1) + "M"
        );
    }

    if (number >= 1_000) {
        return (
            (
                number / 1_000
            ).toFixed(1) + "K"
        );
    }

    return number;
}

export const formatCompactCurrency = (
    value
) => {

    if (!value) return "$0";

    const number = Number(value);

    if (number >= 1_000_000_000) {
        return (
            "$" +
            (
                number / 1_000_000_000
            ).toFixed(1) +
            "B"
        );
    }

    if (number >= 1_000_000) {
        return (
            "$" +
            (
                number / 1_000_000
            ).toFixed(1) +
            "M"
        );
    }

    if (number >= 1_000) {
        return (
            "$" +
            (
                number / 1_000
            ).toFixed(1) +
            "K"
        );
    }

    return "$" + number.toString();
};
