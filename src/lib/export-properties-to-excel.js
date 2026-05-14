import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

const formatCurrency = (value) => {
    return Number(value || 0);
};

export const exportPropertiesToExcel = (
    properties
) => {

    const formattedData =
        properties.map(
            (property) => ({
                Account:
                    property.acct || "",

                "Property Address":
                    property.property_address ||
                    "",

                "Owner Name":
                    property.owner_name ||
                    "",

                "Mailing Address":
                    property.mailing_address ||
                    "",

                "State Class":
                    property.state_class ||
                    "",

                "Market Area":
                    property.market_area_1_dscr ||
                    "",

                Neighborhood:
                    property.neighborhood_code ||
                    "",

                "Building Area":
                    Number(
                        property.building_area || 0
                    ),

                "Land Area":
                    Number(
                        property.land_area || 0
                    ),

                Acreage:
                    Number(
                        property.acreage || 0
                    ),

                "Market Value":
                    formatCurrency(
                        property.market_value
                    ),

                "Assessed Value":
                    formatCurrency(
                        property.assessed_val
                    ),

                "Year Built":
                    property.yr_impr || "",

                "Notice Status":
                    property.value_status ||
                    "",
            })
        );

    const worksheet =
        XLSX.utils.json_to_sheet(
            formattedData
        );

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Saved Properties"
    );

    const excelBuffer =
        XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

    const fileData = new Blob(
        [excelBuffer],
        {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
    );

    saveAs(
        fileData,
        `saved-properties-${Date.now()}.xlsx`
    );
};
