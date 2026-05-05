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

import { Badge } from "@/components/ui/badge";

function Index() {

    /**
     * =====================================
     * STATES
     * =====================================
     */

    const [properties, setProperties] = useState([]);

    const [loading, setLoading] = useState(false);

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

    /**
     * =====================================
     * FETCH DATA
     * =====================================
     */

    const fetchProperties = async (customCursor = null) => {
        try {
            setLoading(true);

            const params = {
                ...filters,
                ...sorting,
            };

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

        await fetchProperties(pagination.next_cursor);
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
     * FORMATTERS
     * =====================================
     */

    const formatCurrency = (value) => {
        if (!value) return "-";

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value) => {
        if (!value) return "-";

        return new Intl.NumberFormat("en-US").format(value);
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
                header: "Address",
                cell: ({ row }) => (
                    <div className="min-w-[250px]">
                        <div className="font-medium text-sm">
                            {row.original.property_address}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                            {row.original.acct}
                        </div>
                    </div>
                ),
            },

            {
                accessorKey: "owner_name",
                header: "Owner",
                cell: ({ row }) => (
                    <div className="min-w-[250px]">
                        {row.original.owner_name}
                    </div>
                ),
            },

            {
                accessorKey: "state_class",
                header: "State Class",
                cell: ({ row }) => (
                    <Badge variant="outline">
                        {row.original.state_class}
                    </Badge>
                ),
            },

            {
                accessorKey: "building_area",
                header: () => (
                    <button
                        onClick={() => handleSort("building_area")}
                        className="font-semibold"
                    >
                        Building Area
                    </button>
                ),
                cell: ({ row }) =>
                    formatNumber(row.original.building_area),
            },

            {
                accessorKey: "land_area",
                header: "Land Area",
                cell: ({ row }) =>
                    formatNumber(row.original.land_area),
            },

            {
                accessorKey: "market_value",
                header: () => (
                    <button
                        onClick={() => handleSort("market_value")}
                        className="font-semibold"
                    >
                        Market Value
                    </button>
                ),
                cell: ({ row }) => (
                    <div className="font-semibold">
                        {formatCurrency(row.original.market_value)}
                    </div>
                ),
            },

            {
                accessorKey: "filters.neighborhood",
                header: "Neighborhood",
                cell: ({ row }) =>
                    row.original.filters?.neighborhood || "-",
            },

            {
                accessorKey: "filters.market_area",
                header: "Market Area",
                cell: ({ row }) =>
                    row.original.filters?.market_area || "-",
            },
        ],
        [sorting]
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
        <div className="p-6 space-y-6">

            {/* =====================================
          FILTERS
      ===================================== */}

            <Card className="rounded-2xl border shadow-sm">
                <CardContent className="p-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

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
                                    min_market_value: e.target.value,
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
                                    max_market_value: e.target.value,
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

            <Card className="rounded-2xl border shadow-sm overflow-hidden">
                <CardContent className="p-0 overflow-auto">

                    <Table>

                        <TableHeader className="bg-muted/50">

                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>

                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="whitespace-nowrap"
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
                                        className="hover:bg-muted/40 transition"
                                    >

                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-4"
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
                            setFilters({
                                ...filters,
                                limit: Number(value),
                            });

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

        </div>
    );
}

export default Index;
