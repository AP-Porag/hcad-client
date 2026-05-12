import { useMemo, useState } from "react";

import axios from "axios";

import {
    Search,
    SlidersHorizontal,
    Building2,
    DollarSign,
    MapPin,
    User2,
    Loader2,
    RotateCcw,
} from "lucide-react";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Link } from "react-router-dom";

import { API_BASE_URL } from "@/config/api";

import {
    formatCurrency,
    formatNumber,
} from "@/lib/format";

import {
    PROPERTY_STATE_CLASS,
} from "@/constants/property-state-class";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Badge,
} from "@/components/ui/badge";

import {
    Button,
} from "@/components/ui/button";

import {
    Input,
} from "@/components/ui/input";

import {
    Separator,
} from "@/components/ui/separator";

import {
    ScrollArea,
} from "@/components/ui/scroll-area";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Index() {

    const [loading, setLoading] = useState(false);

    const [properties, setProperties] = useState([]);

    const [selectedProperty, setSelectedProperty] = useState(null);

    const [sheetOpen, setSheetOpen] = useState(false);

    const [pagination, setPagination] = useState({
        next_cursor: null,
        has_next: false,
        limit: 25,
    });

    const [cursorStack, setCursorStack] = useState([]);

    const [filters, setFilters] = useState({
        keyword: "",
        owner_name: "",
        property_address: "",
        mailing_address: "",

        min_market_value: "",
        max_market_value: "",

        min_land_area: "",
        max_land_area: "",

        min_building_area: "",
        max_building_area: "",

        occupancy_type: "",

        limit: 25,
    });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const fetchProperties = async (
        customCursor = null,
        isNext = false,
    ) => {

        try {

            setLoading(true);

            const params = {
                limit: filters.limit,
            };

            Object.entries(filters).forEach(([key, value]) => {

                if (
                    value !== "" &&
                    value !== null &&
                    value !== undefined
                ) {
                    params[key] = value;
                }
            });

            if (customCursor) {
                params.cursor = customCursor;
            }

            const response = await axios.get(
                `${API_BASE_URL}/properties/search`,
                {
                    params,
                }
            );

            setProperties(response.data.data || []);

            setPagination(response.data.pagination || {});

            if (isNext && customCursor) {
                setCursorStack((prev) => [...prev, customCursor]);
            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    const resetFilters = () => {

        setFilters({
            keyword: "",
            owner_name: "",
            property_address: "",
            mailing_address: "",

            min_market_value: "",
            max_market_value: "",

            min_land_area: "",
            max_land_area: "",

            min_building_area: "",
            max_building_area: "",

            occupancy_type: "",

            limit: 25,
        });

        setProperties([]);

        setCursorStack([]);
    };

    const columns = useMemo(() => [

        {
            accessorKey: "property_address",

            header: "Property",

            cell: ({ row }) => (

                <div className="min-w-[280px]">

                    <p className="font-semibold text-slate-900">
                        {row.original.property_address || "-"}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                        <Building2 className="h-3.5 w-3.5" />

                        {row.original.acct}

                    </div>

                </div>
            ),
        },

        {
            accessorKey: "owner_name",

            header: "Owner",

            cell: ({ row }) => (

                <div className="min-w-[220px]">

                    <p className="font-medium text-slate-700">
                        {row.original.owner_name || "-"}
                    </p>

                </div>
            ),
        },

        {
            accessorKey: "state_class",

            header: "State Class",

            cell: ({ row }) => (

                <Badge
                    variant="secondary"
                    className="rounded-full"
                >
                    {
                        PROPERTY_STATE_CLASS[
                            row.original.state_class
                            ] || row.original.state_class
                    }
                </Badge>
            ),
        },

        {
            accessorKey: "market_value",

            header: "Market Value",

            cell: ({ row }) => (

                <div className="font-bold whitespace-nowrap text-emerald-600">
                    {formatCurrency(row.original.market_value || 0)}
                </div>
            ),
        },

        {
            accessorKey: "building_area",

            header: "Building Area",

            cell: ({ row }) => (

                <div className="whitespace-nowrap font-medium text-slate-700">
                    {formatNumber(row.original.building_area || 0)} SqFt
                </div>
            ),
        },

        {
            accessorKey: "land_area",

            header: "Land Area",

            cell: ({ row }) => (

                <div className="whitespace-nowrap font-medium text-slate-700">
                    {formatNumber(row.original.land_area || 0)} SqFt
                </div>
            ),
        },

    ], []);

    const table = useReactTable({
        data: properties,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (

        <div className="space-y-6">

            {/* HERO */}

            {/*<div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#020617] via-[#071133] to-[#0f172a] p-8 text-white shadow-2xl">*/}

            {/*    <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">*/}

            {/*        <div className="max-w-3xl">*/}

            {/*            <div className="flex flex-wrap items-center gap-3">*/}

            {/*                <Badge className="bg-blue-600 hover:bg-blue-600">*/}
            {/*                    Enterprise Search*/}
            {/*                </Badge>*/}

            {/*                <Badge className="bg-emerald-600 hover:bg-emerald-600">*/}
            {/*                    Advanced Intelligence*/}
            {/*                </Badge>*/}

            {/*                <Badge className="bg-purple-600 hover:bg-purple-600">*/}
            {/*                    Houston Property Data*/}
            {/*                </Badge>*/}

            {/*            </div>*/}

            {/*            <h1 className="mt-5 text-5xl font-black tracking-tight">*/}
            {/*                Advanced Property Search*/}
            {/*            </h1>*/}

            {/*            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">*/}
            {/*                Explore Houston property intelligence using*/}
            {/*                advanced ownership filters, valuation ranges,*/}
            {/*                land metrics, market segmentation,*/}
            {/*                and property-level search.*/}
            {/*            </p>*/}

            {/*        </div>*/}

            {/*        <div className="grid gap-4 md:grid-cols-2">*/}

            {/*            <AnalyticsCard*/}
            {/*                title="Search Engine"*/}
            {/*                value="Enterprise"*/}
            {/*                icon={<Search className="h-5 w-5" />}*/}
            {/*            />*/}

            {/*            <AnalyticsCard*/}
            {/*                title="HCAD Source"*/}
            {/*                value="Live"*/}
            {/*                icon={<User2 className="h-5 w-5" />}*/}
            {/*            />*/}

            {/*        </div>*/}

            {/*    </div>*/}

            {/*</div>*/}

            {/* MAIN */}

            <div className="grid gap-6 xl:grid-cols-[360px_1fr]">

                {/* SIDEBAR */}

                <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">

                    <CardContent className="p-0">

                        <div className="border-b bg-slate-50 p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Search Filters
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Precision exploration
                                    </p>

                                </div>

                                <div className="rounded-2xl bg-slate-900 p-3 text-white">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </div>

                            </div>

                        </div>

                        <ScrollArea className="h-[calc(100vh-240px)]">

                            <div className="space-y-5 p-6">

                                <FilterLabel title="Keyword" />

                                <Input
                                    placeholder="Search..."
                                    value={filters.keyword}
                                    onChange={(e) => updateFilter(
                                        "keyword",
                                        e.target.value,
                                    )}
                                />

                                <FilterLabel title="Owner Name" />

                                <Input
                                    placeholder="Owner name"
                                    value={filters.owner_name}
                                    onChange={(e) => updateFilter(
                                        "owner_name",
                                        e.target.value,
                                    )}
                                />

                                <FilterLabel title="Property Address" />

                                <Input
                                    placeholder="Property address"
                                    value={filters.property_address}
                                    onChange={(e) => updateFilter(
                                        "property_address",
                                        e.target.value,
                                    )}
                                />

                                <Separator />

                                <div className="grid grid-cols-2 gap-3">

                                    <Input
                                        placeholder="Min Market"
                                        value={filters.min_market_value}
                                        onChange={(e) => updateFilter(
                                            "min_market_value",
                                            e.target.value,
                                        )}
                                    />

                                    <Input
                                        placeholder="Max Market"
                                        value={filters.max_market_value}
                                        onChange={(e) => updateFilter(
                                            "max_market_value",
                                            e.target.value,
                                        )}
                                    />

                                </div>

                                <div className="grid grid-cols-2 gap-3">

                                    <Input
                                        placeholder="Min Building"
                                        value={filters.min_building_area}
                                        onChange={(e) => updateFilter(
                                            "min_building_area",
                                            e.target.value,
                                        )}
                                    />

                                    <Input
                                        placeholder="Max Building"
                                        value={filters.max_building_area}
                                        onChange={(e) => updateFilter(
                                            "max_building_area",
                                            e.target.value,
                                        )}
                                    />

                                </div>

                                <Select
                                    value={String(filters.limit)}
                                    onValueChange={(value) => updateFilter(
                                        "limit",
                                        Number(value),
                                    )}
                                >

                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>

                                        <SelectItem value="25">
                                            25 Results
                                        </SelectItem>

                                        <SelectItem value="50">
                                            50 Results
                                        </SelectItem>

                                    </SelectContent>

                                </Select>

                                <div className="grid grid-cols-2 gap-3 pt-4">

                                    <Button
                                        disabled={loading}
                                        onClick={() => {
                                            setCursorStack([]);
                                            fetchProperties();
                                        }}
                                    >

                                        {
                                            loading
                                                ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )
                                                : (
                                                    <Search className="mr-2 h-4 w-4" />
                                                )
                                        }

                                        Search

                                    </Button>

                                    <Button
                                        variant="secondary"
                                        onClick={resetFilters}
                                    >

                                        <RotateCcw className="mr-2 h-4 w-4" />

                                        Reset

                                    </Button>

                                </div>

                            </div>

                        </ScrollArea>

                    </CardContent>

                </Card>

                {/* TABLE */}

                <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">

                    <CardContent className="p-0">

                        <div className="border-b p-6">

                            <h2 className="text-xl font-bold text-slate-900">
                                Search Results
                            </h2>

                        </div>

                        <div className="overflow-x-auto">

                            <Table>

                                <TableHeader>

                                    {
                                        table.getHeaderGroups().map((headerGroup) => (

                                            <TableRow key={headerGroup.id}>

                                                {
                                                    headerGroup.headers.map((header) => (

                                                        <TableHead key={header.id}>

                                                            {
                                                                flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext(),
                                                                )
                                                            }

                                                        </TableHead>

                                                    ))
                                                }

                                            </TableRow>

                                        ))
                                    }

                                </TableHeader>

                                <TableBody>

                                    {
                                        table.getRowModel().rows.length
                                            ? (
                                                table.getRowModel().rows.map((row) => (

                                                    <TableRow
                                                        key={row.id}
                                                        className="cursor-pointer transition hover:bg-slate-50"
                                                        onClick={() => {
                                                            setSelectedProperty(row.original);
                                                            setSheetOpen(true);
                                                        }}
                                                    >

                                                        {
                                                            row.getVisibleCells().map((cell) => (

                                                                <TableCell key={cell.id}>

                                                                    {
                                                                        flexRender(
                                                                            cell.column.columnDef.cell,
                                                                            cell.getContext(),
                                                                        )
                                                                    }

                                                                </TableCell>

                                                            ))
                                                        }

                                                    </TableRow>

                                                ))
                                            )
                                            : (
                                                <TableRow>

                                                    <TableCell
                                                        colSpan={columns.length}
                                                        className="h-40 text-center"
                                                    >
                                                        No search results.
                                                    </TableCell>

                                                </TableRow>
                                            )
                                    }

                                </TableBody>

                            </Table>

                        </div>

                    </CardContent>

                </Card>

            </div>

            {/* SHEET */}

            <Sheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            >

                <SheetContent className="overflow-y-auto sm:max-w-2xl">

                    {
                        selectedProperty && (

                            <div className="space-y-6">

                                <SheetHeader>

                                    <SheetTitle className="text-2xl font-black">
                                        {selectedProperty.property_address}
                                    </SheetTitle>

                                </SheetHeader>

                                <QuickStatCard
                                    title="Market Value"
                                    value={formatCurrency(selectedProperty.market_value || 0)}
                                    icon={<DollarSign className="h-5 w-5" />}
                                />

                                <QuickStatCard
                                    title="Building Area"
                                    value={`${formatNumber(selectedProperty.building_area || 0)} SqFt`}
                                    icon={<Building2 className="h-5 w-5" />}
                                />

                                <QuickStatCard
                                    title="Land Area"
                                    value={`${formatNumber(selectedProperty.land_area || 0)} SqFt`}
                                    icon={<MapPin className="h-5 w-5" />}
                                />

                                <Button
                                    asChild
                                    className="w-full"
                                >

                                    <Link
                                        to={`/admin/property/${selectedProperty._id}`}
                                    >
                                        View Full Details
                                    </Link>

                                </Button>

                            </div>

                        )
                    }

                </SheetContent>

            </Sheet>

        </div>
    );
}

function FilterLabel({ title }) {

    return (
        <p className="text-sm font-semibold text-slate-700">
            {title}
        </p>
    );
}

function AnalyticsCard({
                           title,
                           value,
                           icon,
                       }) {

    return (

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">

            <div className="flex items-center justify-between">

                <div className="rounded-2xl bg-white/10 p-3">
                    {icon}
                </div>

                <Badge className="bg-white/10 text-white hover:bg-white/10">
                    Live
                </Badge>

            </div>

            <div className="mt-10">

                <p className="text-sm text-slate-400">
                    {title}
                </p>

                <h2 className="mt-2 text-3xl font-black text-white">
                    {value}
                </h2>

            </div>

        </div>
    );
}

function QuickStatCard({
                           title,
                           value,
                           icon,
                       }) {

    return (

        <Card className="rounded-3xl border-0 shadow-sm">

            <CardContent className="flex items-center justify-between p-6">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                        {value}
                    </h3>

                </div>

                <div className="rounded-2xl bg-slate-100 p-4 text-slate-900">
                    {icon}
                </div>

            </CardContent>

        </Card>
    );
}
