import axios from "@/lib/axios";

export const saveProperty = async (
    propertyAcct
) => {
    const response = await axios.post(
        "/saved-properties",
        {
            property_acct: propertyAcct,
        }
    );

    return response.data;
};

export const removeSavedProperty =
    async (propertyAcct) => {
        const response =
            await axios.delete(
                `/saved-properties/${propertyAcct}`
            );

        return response.data;
    };

export const checkSavedProperty =
    async (propertyAcct) => {
        const response =
            await axios.get(
                `/saved-properties/check/${propertyAcct}`
            );

        return response.data;
    };

export const getSavedProperties =
    async () => {
        const response =
            await axios.get(
                "/saved-properties"
            );

        return response.data;
    };
export const getSavedPropertyAccts =
    async () => {
        const response =
            await axios.get(
                "/saved-properties/accts"
            );

        return response.data;
    };
