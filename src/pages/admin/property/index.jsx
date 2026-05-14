import PropertyPreviewSheet from "@/components/property/property-preview-sheet";
import { useEffect, useMemo, useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { toast } from "sonner";

import { getProperties } from "@/services/property.service";

import { Card, CardContent } from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BookmarkCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
    formatCurrency,
    formatNumber, formatPropertyAddress,
} from "@/lib/format";

import { PROPERTY_STATE_CLASS } from "@/constants/property-state-class";
import {getSavedProperties, getSavedPropertyAccts} from "@/services/saved-property.service.js";

function Index() {

    /**
     * =====================================
     * STATES
     * =====================================
     */

    const [properties, setProperties] = useState([]);

    const [loading, setLoading] = useState(false);

    const [selectedProperty, setSelectedProperty] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);

    const [pagination, setPagination] = useState({
        next_cursor: null,
        has_next: false,
        limit: 25,
    });

    const [cursorHistory, setCursorHistory] = useState([]);

    const [filters, setFilters] = useState({
        keyword: "",
        state_class: "",
        neighborhood: "",
        min_market_value: "",
        max_market_value: "",
        limit: 25,
    });

    const [sorting, setSorting] = useState({
        sort_by: "market_value",
        sort_order: "desc",
    });

    const [savedPropertyAccts, setSavedPropertyAccts] =
        useState(new Set());

    const fetchSavedPropertyAccts =
        async () => {
            try {
                const response =
                    await getSavedPropertyAccts();

                setSavedPropertyAccts(
                    new Set(response.data)
                );
            } catch (error) {
                console.error(error);
            }
        };

    useEffect(() => {
        fetchSavedPropertyAccts();
    }, []);

    const [savedProperties, setSavedProperties] =
        useState([]);

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
    // const allProperties =
    //     savedProperties
    //         .map(
    //             (item) => item.property
    //         )
    //         .filter(Boolean);

    /**
     * =====================================
     * FETCH DATA
     * =====================================
     */

    const fetchProperties = async (customCursor = null) => {

        try {

            setLoading(true);

            // const params = {
            //     ...filters,
            //     ...sorting,
            // };
            //
            // if (customCursor) {
            //     params.cursor = customCursor;
            // }

            const params = {
                limit: filters.limit,
            };

            if (filters.keyword?.trim()) {
                params.keyword = filters.keyword.trim();
            }

            if (filters.state_class?.trim()) {
                params.state_class = filters.state_class.trim();
            }

            if (filters.neighborhood?.trim()) {
                params.neighborhood = filters.neighborhood.trim();
            }

            if (filters.min_market_value) {
                params.min_market_value = filters.min_market_value;
            }

            if (filters.max_market_value) {
                params.max_market_value = filters.max_market_value;
            }

            /**
             * SORTING
             */
            if (sorting.sort_by?.trim()) {
                params.sort_by = sorting.sort_by;
            }

            if (sorting.sort_order?.trim()) {
                params.sort_order = sorting.sort_order;
            }

            /**
             * CURSOR
             */
            if (customCursor) {
                params.cursor = customCursor;
            }

            const response = await getProperties(params);

            if (!response.success) {
                throw new Error("Failed to load properties");
            }

            setProperties(response.data);

            setPagination(response.pagination);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load properties"
            );

        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================
     * INITIAL LOAD
     * =====================================
     */

    useEffect(() => {
        fetchProperties();
    }, []);

    /**
     * =====================================
     * APPLY FILTERS
     * =====================================
     */

    const applyFilters = () => {
        setCursorHistory([]);
        fetchProperties();
    };

    /**
     * =====================================
     * NEXT PAGE
     * =====================================
     */

    const handleNext = async () => {

        if (!pagination.next_cursor) return;

        setCursorHistory((prev) => [
            ...prev,
            pagination.next_cursor,
        ]);

        await fetchProperties(
            pagination.next_cursor
        );
    };

    /**
     * =====================================
     * PREVIOUS PAGE
     * =====================================
     */

    const handlePrevious = async () => {

        if (cursorHistory.length <= 1) {
            setCursorHistory([]);
            return fetchProperties();
        }

        const updated = [...cursorHistory];

        updated.pop();

        const previousCursor =
            updated[updated.length - 1] || null;

        setCursorHistory(updated);

        await fetchProperties(previousCursor);
    };

    /**
     * =====================================
     * SORTING
     * =====================================
     */

    const handleSort = (field) => {

        let order = "desc";

        if (
            sorting.sort_by === field &&
            sorting.sort_order === "desc"
        ) {
            order = "asc";
        }

        setSorting({
            sort_by: field,
            sort_order: order,
        });

        fetchProperties();
    };

    /**
     * =====================================
     * TABLE COLUMNS
     * =====================================
     */

    const columns = useMemo(
        () => [
            {
                accessorKey: "property_address",

                header: "Property",

                // cell: ({ row }) => (
                //
                //     <div className="min-w-[320px]">
                //
                //         <div className="font-semibold text-sm leading-6 text-gray-900">
                //             {formatPropertyAddress(row.original.property_address) || "-"}
                //         </div>
                //
                //         <div className="text-xs text-muted-foreground mt-1">
                //             Account:
                //             {" "}
                //             {row.original.acct || "-"}
                //         </div>
                //
                //     </div>
                // ),
                cell: ({ row }) => {

                    const formatted =
                        formatPropertyAddress(
                            row.original.property_address
                        );

                    return (

                        <div className="">
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">

                                {savedPropertyAccts.has(
                                    row.original.acct
                                ) && (
                                    <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-green-700">
                                        <BookmarkCheck className="h-3.5 w-3.5" />

                                        <span>Saved</span>
                                    </div>
                                )}

                            </div>

                            <div className="font-semibold text-sm leading-6">
                                {formatted.street}
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {formatted.city}, TX {formatted.zip}
                            </div>

                            <div className="text-xs text-muted-foreground mt-2">
                                Account:
                                {" "}
                                {row.original.acct}
                            </div>

                        </div>
                    );
                }
            },

            {
                accessorKey: "owner_name",

                header: "Owner",

                cell: ({ row }) => (

                    <div className="min-w-[260px]">

                        <div className="font-medium text-sm leading-6">
                            {row.original.owner_name || "-"}
                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "state_class",

                header: "State Class",

                cell: ({ row }) => (

                    <div className="min-w-[220px]">

                        <div className="font-medium text-sm">
                            {
                                PROPERTY_STATE_CLASS[
                                    row.original.state_class
                                    ] || row.original.state_class
                            }
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                            [{row.original.state_class || "-"}]
                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "building_area",

                header: () => (
                    <button
                        onClick={() =>
                            handleSort("building_area")
                        }
                        className="font-semibold"
                    >
                        Building Area
                    </button>
                ),

                cell: ({ row }) => (

                    <div className="min-w-[160px]">

                        <div className="font-medium">
                            {
                                row.original.building_area
                                    ? `${formatNumber(
                                        row.original.building_area
                                    )} SqFt`
                                    : "-"
                            }
                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "land_area",

                header: "Land Area",

                cell: ({ row }) => (

                    <div className="min-w-[160px]">

                        <div className="font-medium">
                            {
                                row.original.land_area
                                    ? `${formatNumber(
                                        row.original.land_area
                                    )} SqFt`
                                    : "-"
                            }
                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "market_value",

                header: () => (
                    <button
                        onClick={() =>
                            handleSort("market_value")
                        }
                        className="font-semibold"
                    >
                        Market Value
                    </button>
                ),

                cell: ({ row }) => {
                    const value = Number(
                        row.original.market_value || 0
                    );

                    return (

                        <div className="min-w-[180px]">
                            {
                                value > 0
                                    ? (
                                        <div className="font-semibold text-sm text-emerald-700">
                                            {formatCurrency(value)}
                                        </div>
                                    )
                                    : (
                                        <span className="text-muted-foreground">
                                -
                            </span>
                                    )
                            }

                        </div>
                    );
                },
            },

            // {
            //     accessorKey: "filters.neighborhood",
            //
            //     header: "Neighborhood",
            //
            //     cell: ({ row }) => (
            //
            //         <div className="min-w-[180px]">
            //
            //             {
            //                 row.original.filters?.neighborhood
            //                     ? (
            //                         <Badge
            //                             variant="secondary"
            //                             className="rounded-md"
            //                         >
            //                             {
            //                                 row.original.filters
            //                                     ?.neighborhood
            //                             }
            //                         </Badge>
            //                     )
            //                     : (
            //                         <span className="text-muted-foreground text-sm">
            //                 -
            //             </span>
            //                     )
            //             }
            //
            //         </div>
            //     ),
            // },
            //
            // {
            //     accessorKey: "filters.market_area",
            //
            //     header: "Market Area",
            //
            //     cell: ({ row }) => (
            //
            //         <div className="min-w-[180px]">
            //
            //             {
            //                 row.original.filters?.market_area
            //                     ? (
            //                         <Badge
            //                             variant="outline"
            //                             className="rounded-md"
            //                         >
            //                             {
            //                                 row.original.filters
            //                                     ?.market_area
            //                             }
            //                         </Badge>
            //                     )
            //                     : (
            //                         <span className="text-muted-foreground text-sm">
            //                 -
            //             </span>
            //                     )
            //             }
            //
            //         </div>
            //     ),
            // },
        ],
        [sorting,savedPropertyAccts]
    );

    /**
     * =====================================
     * TABLE INSTANCE
     * =====================================
     */

    const table = useReactTable({
        data: properties,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (

        <div className="p-4 md:p-6 space-y-6">

            {/* =====================================
            FILTERS
            ===================================== */}

            <Card className="rounded-2xl border shadow-sm">

                <CardContent className="p-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">

                        <Input
                            placeholder="Search address / owner"
                            value={filters.keyword}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    keyword: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="State Class"
                            value={filters.state_class}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    state_class: e.target.value,
                                })
                            }
                        />

                        <Input
                            placeholder="Neighborhood"
                            value={filters.neighborhood}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    neighborhood: e.target.value,
                                })
                            }
                        />

                        <Input
                            type="number"
                            placeholder="Min Value"
                            value={filters.min_market_value}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    min_market_value:
                                    e.target.value,
                                })
                            }
                        />

                        <Input
                            type="number"
                            placeholder="Max Value"
                            value={filters.max_market_value}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    max_market_value:
                                    e.target.value,
                                })
                            }
                        />

                        <Button onClick={applyFilters}>
                            Apply Filters
                        </Button>

                    </div>

                </CardContent>

            </Card>

            {/* =====================================
            TABLE
            ===================================== */}

            <Card className="rounded-2xl border shadow-sm overflow-hidden max-w-295">

                <CardContent className="p-0">

                    <div className="w-full overflow-x-auto">

                        <Table className="min-w-[1550px]">

                            <TableHeader className="bg-muted/50">

                                {table.getHeaderGroups().map((headerGroup) => (

                                    <TableRow key={headerGroup.id}>

                                        {headerGroup.headers.map((header) => (

                                            <TableHead
                                                key={header.id}
                                                className="whitespace-nowrap text-xs uppercase tracking-wide font-semibold"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </TableHead>

                                        ))}

                                    </TableRow>

                                ))}

                            </TableHeader>

                            <TableBody>

                                {table.getRowModel().rows.length ? (

                                    table.getRowModel().rows.map((row) => (

                                        <TableRow
                                            key={row.id}
                                            className="cursor-pointer transition-all duration-200 hover:bg-muted/50"
                                            onClick={() => {
                                                setSelectedProperty(row.original);
                                                setOpenPreview(true);
                                            }}
                                        >

                                            {row.getVisibleCells().map((cell) => (

                                                <TableCell
                                                    key={cell.id}
                                                    className="py-5 align-top"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>

                                            ))}

                                        </TableRow>

                                    ))

                                ) : (

                                    <TableRow>

                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No properties found
                                        </TableCell>

                                    </TableRow>

                                )}

                            </TableBody>

                        </Table>

                    </div>

                </CardContent>

            </Card>

            {/* =====================================
            PAGINATION
            ===================================== */}

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-2">

                    <span className="text-sm text-muted-foreground">
                        Rows per page
                    </span>

                    <Select
                        value={String(filters.limit)}
                        onValueChange={(value) => {

                            const updatedFilters = {
                                ...filters,
                                limit: Number(value),
                            };

                            setFilters(updatedFilters);

                            fetchProperties();

                        }}
                    >

                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>

                    </Select>

                </div>

                <div className="flex items-center gap-2">

                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={loading}
                    >
                        Previous
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!pagination.has_next || loading}
                    >
                        Next
                    </Button>

                </div>

            </div>

            {/* =====================================
            LOADING MODAL
            ===================================== */}

            <Dialog open={loading}>

                <DialogContent
                    className="sm:max-w-md [&>button]:hidden"
                >

                    <div className="flex flex-col items-center justify-center py-12">

                        <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />

                        <div className="mt-6 text-sm text-muted-foreground">
                            Loading properties...
                        </div>

                    </div>

                </DialogContent>

            </Dialog>

            <PropertyPreviewSheet
                open={openPreview}
                onOpenChange={setOpenPreview}
                property={selectedProperty}
                onPropertySaved={(acct) => {
                    setSavedPropertyAccts(
                        (prev) =>
                            new Set([
                                ...prev,
                                acct,
                            ])
                    );
                    setOpenPreview(false);
                }}
                onPropertyRemoved={(acct) => {

                    setSavedPropertyAccts(
                        (prev) =>
                            new Set(
                                [...prev].filter(
                                    (item) =>
                                        item !== acct
                                )
                            )
                    );
                    setOpenPreview(false);

                }}
            />

        </div>
    );
}

export default Index;
