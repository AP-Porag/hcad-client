import {
    useEffect,
    useState,
} from "react";

import {
    Bookmark,
    Loader2,
    Download,
} from "lucide-react";

import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";

import { getSavedProperties } from "@/services/saved-property.service";

import PropertyPreviewSheet from "@/components/property/property-preview-sheet";
import { exportPropertiesToExcel } from "@/lib/export-properties-to-excel";

const formatCurrency = (value) => {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }
    ).format(value || 0);
};

export default function SavedPropertiesPage() {
    const [loading, setLoading] =
        useState(true);

    const [savedProperties, setSavedProperties] =
        useState([]);

    const [
        selectedProperties,
        setSelectedProperties,
    ] = useState([]);

    const [
        selectedProperty,
        setSelectedProperty,
    ] = useState(null);

    const [sheetOpen, setSheetOpen] =
        useState(false);

    const fetchSavedProperties =
        async () => {
            try {
                setLoading(true);

                const response =
                    await getSavedProperties();

                setSavedProperties(
                    response.data || []
                );
            } catch (error) {
                toast.error(
                    "Failed to fetch saved properties"
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchSavedProperties();
    }, []);
    const allProperties =
        savedProperties
            .map(
                (item) => item.property
            )
            .filter(Boolean);

    const isAllSelected =
        allProperties.length > 0 &&
        selectedProperties.length ===
        allProperties.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedProperties([]);
        } else {
            setSelectedProperties(
                allProperties
            );
        }
    };

    const handleSelectProperty = (
        e,
        property
    ) => {
        e.stopPropagation();

        const exists =
            selectedProperties.find(
                (item) =>
                    item.acct ===
                    property.acct
            );

        if (exists) {
            setSelectedProperties(
                selectedProperties.filter(
                    (item) =>
                        item.acct !==
                        property.acct
                )
            );

            console.log(selectedProperties)
        } else {
            setSelectedProperties([
                ...selectedProperties,
                property,
            ]);
        }
    };

    const isSelected = (
        propertyAcct
    ) => {
        return selectedProperties.some(
            (item) =>
                item.acct === propertyAcct
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Bookmark className="h-6 w-6" />

                        <h1 className="text-2xl font-bold">
                            Saved Properties
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your saved properties
                    </p>
                </div>

                <button
                    onClick={() => {

                        exportPropertiesToExcel(
                            selectedProperties
                        );

                        setSelectedProperties([]);

                    }}
                    disabled={
                        selectedProperties.length === 0
                    }
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
                >
                    <Download className="h-4 w-4" />

                    Download Excel

                    <span>
                        (
                        {
                            selectedProperties.length
                        }
                        )
                    </span>
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                        <tr>
                            {/*<th className="w-14 px-4 py-4">*/}
                            {/*    Select*/}
                            {/*</th>*/}
                            <th className="w-14 px-4 py-4">
                                <div className="flex justify-center">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={
                                            handleSelectAll
                                        }
                                    />
                                    <label htmlFor="select-all" className="sr-only">
                                        Select All
                                    </label>
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Property Address
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Owner
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Market Value
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Account
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-20 text-center"
                                >
                                    <div className="flex justify-center">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        ) : savedProperties.length ===
                        0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-20 text-center text-muted-foreground"
                                >
                                    No saved properties found
                                </td>
                            </tr>
                        ) : (
                            savedProperties.map(
                                (item) => {
                                    const property =
                                        item.property;

                                    if (!property)
                                        return null;

                                    return (
                                        <tr
                                            key={
                                                item._id
                                            }
                                            onClick={() => {
                                                setSelectedProperty(
                                                    property
                                                );

                                                setSheetOpen(
                                                    true
                                                );
                                            }}
                                            className="cursor-pointer border-t transition hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-4">
                                                <div
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        handleSelectProperty(
                                                            e,
                                                            property
                                                        )
                                                    }
                                                >
                                                    <Checkbox
                                                        checked={isSelected(
                                                            property.acct
                                                        )}
                                                    />
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 font-medium">
                                                {
                                                    property.property_address
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    property.owner_name
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatCurrency(
                                                    property.market_value
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    property.acct
                                                }
                                            </td>
                                        </tr>
                                    );
                                }
                            )
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*<PropertyPreviewSheet*/}
            {/*    open={sheetOpen}*/}
            {/*    onOpenChange={*/}
            {/*        setSheetOpen*/}
            {/*    }*/}
            {/*    property={*/}
            {/*        selectedProperty*/}
            {/*    }*/}
            {/*/>*/}
            <PropertyPreviewSheet
                open={sheetOpen}
                onOpenChange={
                    setSheetOpen
                }
                property={
                    selectedProperty
                }
                onPropertyRemoved={(
                    propertyAcct
                ) => {
                    setSavedProperties(
                        (
                            prev
                        ) =>
                            prev.filter(
                                (
                                    item
                                ) =>
                                    item.property_acct !==
                                    propertyAcct
                            )
                    );

                    setSheetOpen(false);
                }}
            />
        </div>
    );
}
