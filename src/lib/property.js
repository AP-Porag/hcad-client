export const getOccupancyStatus = (
    propertyAddress,
    mailingAddress
) => {

    if (
        !propertyAddress ||
        !mailingAddress
    ) {
        return "Unknown";
    }

    const normalize = (address) =>
        address
            .toUpperCase()
            .replace(/\bSTREET\b/g, "ST")
            .replace(/\bAVENUE\b/g, "AVE")
            .replace(/\bROAD\b/g, "RD")
            .replace(/\bDRIVE\b/g, "DR")
            .replace(/\bBOULEVARD\b/g, "BLVD")
            .replace(/\bTEXAS\b/g, "TX")
            .replace(/[^A-Z0-9 ]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    return normalize(propertyAddress) ===
    normalize(mailingAddress)
        ? "Occupied"
        : "Unoccupied";
};
