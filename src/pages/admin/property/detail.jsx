import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Building2,
    Landmark,
    DollarSign,
    Users,
    MapPinned,
    CalendarClock,
    Warehouse,
    Sparkles,
    Layers3,
    Home,
    Receipt,
    Scale,
    Map,
    FileText,
    Activity,
    Clock3,
    ChevronRight,
    BarChart3,
    DatabaseIcon,
    ShieldCheck,
    PieChartIcon,
} from "lucide-react";

import CountUpModule from "react-countup";
const CountUp = CountUpModule.default || CountUpModule;
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import {
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Legend as RechartsLegend,
} from "recharts";

import { API_BASE_URL } from "@/config/api";

import {
    formatCurrency,
    formatNumber,
    formatPropertyAddress,
} from "@/lib/format";

import { PROPERTY_STATE_CLASS } from "@/constants/property-state-class";

const CHART_COLORS = [
    "#0f172a",
    "#1e293b",
    "#334155",
    "#475569",
    "#64748b",
    "#94a3b8",
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="overflow-x-auto">
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
                            activeTab === tab
                                ? "bg-slate-900 text-white shadow-lg"
                                : "text-slate-600 hover:bg-slate-100",
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Badge = ({ children, color = "slate" }) => {
    const colors = {
        slate: "bg-slate-100 text-slate-700 border-slate-200",
        blue: "bg-blue-100 text-blue-700 border-blue-200",
        emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
        amber: "bg-amber-100 text-amber-700 border-amber-200",
        violet: "bg-violet-100 text-violet-700 border-violet-200",
        red: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-xl border px-3 py-1 text-xs font-bold",
                colors[color],
            )}
        >
            {children}
        </span>
    );
};

const SimpleCard = ({ children, className = "" }) => {
    return (
        <div
            className={cn(
                "rounded-3xl border border-slate-200 bg-white shadow-sm",
                className,
            )}
        >
            {children}
        </div>
    );
};

const MetricCard = ({
                        title,
                        value,
                        subtitle,
                        icon,
                        gradient = "from-slate-900 to-slate-700",
                    }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-2xl",
                gradient,
            )}
        >
            <div className="mb-5 flex items-start justify-between">
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                    {icon}
                </div>

                <Badge color="slate">Live</Badge>
            </div>

            <div className="space-y-2">
                <div className="text-sm text-white/70">{title}</div>

                <div className="text-3xl font-black tracking-tight">
                    {value}
                </div>

                <div className="text-xs text-white/70">{subtitle}</div>
            </div>
        </motion.div>
    );
};

const SectionCard = ({ title, icon, children, right }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
            <div className="border-b border-slate-100 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-slate-100 p-3">
                            {icon}
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {title}
                            </h2>
                        </div>
                    </div>

                    {right}
                </div>
            </div>

            <div className="p-6">{children}</div>
        </motion.div>
    );
};

const DataTable = ({ columns, data }) => {
    return (
        <div className="overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                            {column.label}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                {data?.map((row, index) => (
                    <tr
                        key={row._id || index}
                        className="transition-colors hover:bg-slate-50"
                    >
                        {columns.map((column) => (
                            <td
                                key={column.key}
                                className="whitespace-nowrap px-4 py-3 text-sm text-slate-700"
                            >
                                {column.render
                                    ? column.render(row)
                                    : row[column.key] || "-"}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            {payload.map((entry, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 text-sm"
                >
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{
                            backgroundColor: entry.color,
                        }}
                    />

                    <span className="font-semibold">
                        {entry.name}:
                    </span>

                    <span>
                        {typeof entry.value === "number"
                            ? formatCurrency(entry.value)
                            : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function Detail() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(null);

    const [activeTab, setActiveTab] = useState("Ownership");

    useEffect(() => {
        fetch(`${API_BASE_URL}/properties/${id}`)
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const address = useMemo(() => {
        return formatPropertyAddress(data?.header?.address);
    }, [data]);

    const tabs = [
        "Ownership",
        "Land",
        "Buildings",
        "Features",
        "Tax",
        "Permits",
        "Relationships",
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-100">
                <div className="space-y-4 text-center">
                    <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />

                    <div className="text-lg font-semibold">
                        Loading Enterprise Property Intelligence...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-[1800px] space-y-6 p-6">
                {/* HERO */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-2xl"
                >
                    <div className="grid gap-10 p-8 lg:grid-cols-2">
                        <div>
                            <div className="mb-6 flex flex-wrap gap-3">
                                <Badge color="blue">
                                    {data?.header?.county}
                                </Badge>

                                <Badge color="emerald">
                                    Tax Year {data?.header?.taxYear}
                                </Badge>

                                <Badge color="amber">
                                    {
                                        PROPERTY_STATE_CLASS[
                                            data?.header?.stateClass
                                            ]
                                    }
                                </Badge>

                                <Badge color="violet">
                                    Account #{data?.header?.account}
                                </Badge>
                            </div>

                            <h1 className="text-4xl font-black tracking-tight">
                                {address?.street}
                            </h1>

                            <div className="mt-2 text-lg text-slate-300">
                                {address?.city}, TX {address?.zip}
                            </div>

                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                    <div className="text-xs uppercase tracking-wider text-slate-400">
                                        Owner
                                    </div>

                                    <div className="mt-2 text-lg font-bold">
                                        {data?.header?.owner}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                    <div className="text-xs uppercase tracking-wider text-slate-400">
                                        Market Area
                                    </div>

                                    <div className="mt-2 text-lg font-bold">
                                        {
                                            data?.propertyInfo?.marketArea
                                                ?.area1Description
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                                    <ShieldCheck className="h-4 w-4" />
                                    Property Notes
                                </div>

                                <div className="text-sm leading-7 text-slate-300">
                                    {
                                        data?.buildings?.cores?.[0]
                                            ?.notes
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <MetricCard
                                title="Market Value"
                                value={
                                    <CountUp
                                        end={
                                            data?.valuation?.marketValue || 0
                                        }
                                        prefix="$"
                                        separator=","
                                    />
                                }
                                subtitle="Current Market Assessment"
                                icon={<DollarSign />}
                                gradient="from-emerald-600 to-emerald-800"
                            />

                            <MetricCard
                                title="Building Area"
                                value={
                                    <CountUp
                                        end={
                                            data?.propertyInfo
                                                ?.buildingArea || 0
                                        }
                                        separator=","
                                    />
                                }
                                subtitle="Square Feet"
                                icon={<Building2 />}
                                gradient="from-blue-600 to-indigo-800"
                            />

                            <MetricCard
                                title="Land Area"
                                value={
                                    <CountUp
                                        end={
                                            data?.propertyInfo?.landArea || 0
                                        }
                                        separator=","
                                    />
                                }
                                subtitle="Land Square Feet"
                                icon={<MapPinned />}
                                gradient="from-orange-500 to-red-700"
                            />

                            <MetricCard
                                title="Apartment Units"
                                value={
                                    <CountUp
                                        end={
                                            data?.buildings?.summary
                                                ?.totalUnits || 0
                                        }
                                        separator=","
                                    />
                                }
                                subtitle="Residential Units"
                                icon={<Home />}
                                gradient="from-violet-600 to-purple-800"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* QUICK STATS */}
                <div className="grid gap-6 lg:grid-cols-4">
                    <SimpleCard className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    Market Value / SqFt
                                </div>

                                <div className="mt-2 text-3xl font-black">
                                    {formatCurrency(
                                        data?.analytics
                                            ?.marketValuePerSqFt,
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                                <Activity />
                            </div>
                        </div>
                    </SimpleCard>

                    <SimpleCard className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    Land Value / SqFt
                                </div>

                                <div className="mt-2 text-3xl font-black">
                                    {formatCurrency(
                                        data?.analytics
                                            ?.landValuePerSqFt,
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                                <Map />
                            </div>
                        </div>
                    </SimpleCard>

                    <SimpleCard className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    Total Features
                                </div>

                                <div className="mt-2 text-3xl font-black">
                                    {formatNumber(
                                        data?.analytics
                                            ?.totalFeatures,
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                                <Sparkles />
                            </div>
                        </div>
                    </SimpleCard>

                    <SimpleCard className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    Total Permits
                                </div>

                                <div className="mt-2 text-3xl font-black">
                                    {formatNumber(
                                        data?.analytics
                                            ?.totalPermits,
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                                <FileText />
                            </div>
                        </div>
                    </SimpleCard>
                </div>

                {/* CHARTS */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <SectionCard
                        title="Valuation Intelligence"
                        icon={<PieChartIcon className="h-5 w-5" />}
                    >
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={
                                            data?.charts
                                                ?.valuationBreakdown
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={90}
                                        outerRadius={140}
                                        paddingAngle={3}
                                    >
                                        {data?.charts?.valuationBreakdown?.map(
                                            (_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        CHART_COLORS[
                                                        index %
                                                        CHART_COLORS.length
                                                            ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </Pie>

                                    <RechartsTooltip
                                        content={<CustomTooltip />}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <SimpleCard className="p-5">
                                <div className="text-sm text-slate-500">
                                    Land Value
                                </div>

                                <div className="mt-2 text-2xl font-black">
                                    {formatCurrency(
                                        data?.valuation?.landValue,
                                    )}
                                </div>
                            </SimpleCard>

                            <SimpleCard className="p-5">
                                <div className="text-sm text-slate-500">
                                    Building Value
                                </div>

                                <div className="mt-2 text-2xl font-black">
                                    {formatCurrency(
                                        data?.valuation
                                            ?.buildingValue,
                                    )}
                                </div>
                            </SimpleCard>

                            <SimpleCard className="p-5">
                                <div className="text-sm text-slate-500">
                                    Assessed Value
                                </div>

                                <div className="mt-2 text-2xl font-black">
                                    {formatCurrency(
                                        data?.valuation
                                            ?.assessedValue,
                                    )}
                                </div>
                            </SimpleCard>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Historical Valuation Growth"
                        icon={<Activity className="h-5 w-5" />}
                    >
                        <div className="h-[500px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={
                                        data?.charts?.valueHistory
                                    }
                                >
                                    <defs>
                                        <linearGradient
                                            id="valueGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#0f172a"
                                                stopOpacity={0.5}
                                            />

                                            <stop
                                                offset="95%"
                                                stopColor="#0f172a"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                    />

                                    <XAxis dataKey="name" />

                                    <YAxis
                                        tickFormatter={(value) =>
                                            `$${(
                                                value / 1000000
                                            ).toFixed(0)}M`
                                        }
                                    />

                                    <RechartsTooltip
                                        content={<CustomTooltip />}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="marketValue"
                                        stroke="#0f172a"
                                        fillOpacity={1}
                                        fill="url(#valueGradient)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <SectionCard
                        title="Building Size Analytics"
                        icon={<Warehouse className="h-5 w-5" />}
                    >
                        <div className="h-[500px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={
                                        data?.charts
                                            ?.buildingSizeDistribution
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                    />

                                    <XAxis dataKey="name" />

                                    <YAxis />

                                    <RechartsTooltip
                                        content={<CustomTooltip />}
                                    />

                                    <RechartsLegend />

                                    <Bar
                                        dataKey="sqft"
                                        fill="#0f172a"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Feature Distribution"
                        icon={<BarChart3 className="h-5 w-5" />}
                    >
                        <div className="h-[500px]">
                            <ResponsiveContainer width="100%" height="100%">
                                {/*<BarChart*/}
                                {/*    data={*/}
                                {/*        data?.charts*/}
                                {/*            ?.featureDistribution*/}
                                {/*    }*/}
                                {/*>*/}
                                <BarChart
                                    data={
                                        Object.entries(
                                            (
                                                data?.charts?.featureDistribution || []
                                            ).reduce((acc, item) => {

                                                const name =
                                                    item.name ||
                                                    item.cd ||
                                                    item.type ||
                                                    "Unknown";

                                                const value = Number(
                                                    item.value ||
                                                    item.units ||
                                                    item.uts ||
                                                    item.count ||
                                                    0
                                                );

                                                acc[name] = (acc[name] || 0) + value;

                                                return acc;

                                            }, {})
                                        ).map(([name, value]) => ({
                                            name,
                                            value,
                                        }))
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e2e8f0"
                                    />

                                    <XAxis dataKey="name" />

                                    <YAxis />

                                    <RechartsTooltip
                                        content={<CustomTooltip />}
                                    />

                                    <RechartsLegend />

                                    <Bar
                                        dataKey="value"
                                        fill="#334155"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionCard>
                </div>

                {/* PROPERTY INFO */}
                <SectionCard
                    title="Property Intelligence"
                    icon={<Landmark className="h-5 w-5" />}
                >
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Neighborhood
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {
                                    data?.propertyInfo
                                        ?.neighborhood?.code
                                }
                            </div>

                            <div className="mt-2 text-sm text-slate-500">
                                Group:{" "}
                                {
                                    data?.propertyInfo
                                        ?.neighborhood?.group
                                }
                            </div>
                        </SimpleCard>

                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Market Area
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {
                                    data?.propertyInfo?.marketArea
                                        ?.area1
                                }
                            </div>

                            <div className="mt-2 text-sm text-slate-500">
                                {
                                    data?.propertyInfo?.marketArea
                                        ?.area1Description
                                }
                            </div>
                        </SimpleCard>

                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Year Built
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {data?.propertyInfo?.yearBuilt}
                            </div>

                            <div className="mt-2 text-sm text-slate-500">
                                Effective Construction
                            </div>
                        </SimpleCard>

                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                School District
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {
                                    data?.propertyInfo
                                        ?.schoolDistrict
                                }
                            </div>

                            <div className="mt-2 text-sm text-slate-500">
                                Key Map:{" "}
                                {data?.propertyInfo?.keyMap}
                            </div>
                        </SimpleCard>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                            Legal Description
                        </div>

                        <div className="space-y-2">
                            {data?.propertyInfo?.legalDescription?.map(
                                (item, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl bg-white p-4 text-sm font-medium"
                                    >
                                        {item}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </SectionCard>

                {/* TABS */}
                <div className="space-y-6">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    {activeTab === "Ownership" && (
                        <SectionCard
                            title="Ownership Records"
                            icon={<Users className="h-5 w-5" />}
                        >
                            <DataTable
                                data={data?.tables?.ownersTable}
                                columns={[
                                    {
                                        key: "name",
                                        label: "Owner",
                                    },
                                    {
                                        key: "aka",
                                        label: "AKA",
                                    },
                                    {
                                        key: "pct_own",
                                        label: "Ownership %",
                                    },
                                    {
                                        key: "purchase_date",
                                        label: "Purchase Date",
                                    },
                                    {
                                        key: "site_address",
                                        label: "Site Address",
                                    },
                                ]}
                            />
                        </SectionCard>
                    )}

                    {activeTab === "Land" && (
                        <SectionCard
                            title="Land Details"
                            icon={<Map className="h-5 w-5" />}
                        >
                            <DataTable
                                data={data?.tables?.landTable}
                                columns={[
                                    {
                                        key: "use_cd",
                                        label: "Use Code",
                                    },
                                    {
                                        key: "use_dscr",
                                        label: "Description",
                                    },
                                    {
                                        key: "uts",
                                        label: "Units",
                                        render: (row) =>
                                            formatNumber(row.uts),
                                    },
                                    {
                                        key: "unit_prc",
                                        label: "Unit Price",
                                        render: (row) =>
                                            formatCurrency(
                                                row.unit_prc,
                                            ),
                                    },
                                    {
                                        key: "val",
                                        label: "Value",
                                        render: (row) =>
                                            formatCurrency(row.val),
                                    },
                                ]}
                            />
                        </SectionCard>
                    )}

                    {activeTab === "Buildings" && (
                        <div className="space-y-6">
                            <SectionCard
                                title="Building Core"
                                icon={
                                    <Building2 className="h-5 w-5" />
                                }
                            >
                                <DataTable
                                    data={
                                        data?.tables?.buildingsTable
                                    }
                                    columns={[
                                        {
                                            key: "structure_dscr",
                                            label: "Structure",
                                        },
                                        {
                                            key: "date_erected",
                                            label: "Year Built",
                                        },
                                        {
                                            key: "im_sq_ft",
                                            label: "SqFt",
                                            render: (row) =>
                                                formatNumber(
                                                    row.im_sq_ft,
                                                ),
                                        },
                                        {
                                            key: "units",
                                            label: "Units",
                                        },
                                        {
                                            key: "dscr",
                                            label: "Condition",
                                        },
                                    ]}
                                />
                            </SectionCard>

                            <SectionCard
                                title="Building Sub Areas"
                                icon={<Layers3 className="h-5 w-5" />}
                            >
                                <DataTable
                                    data={
                                        data?.tables
                                            ?.buildingSubAreasTable
                                    }
                                    columns={[
                                        {
                                            key: "sar_cd",
                                            label: "Code",
                                        },
                                        {
                                            key: "sar_dscr",
                                            label: "Description",
                                        },
                                        {
                                            key: "area",
                                            label: "Area",
                                            render: (row) =>
                                                formatNumber(
                                                    row.area,
                                                ),
                                        },
                                    ]}
                                />
                            </SectionCard>
                        </div>
                    )}

                    {activeTab === "Features" && (
                        <SectionCard
                            title="Property Features"
                            icon={<Sparkles className="h-5 w-5" />}
                        >
                            <DataTable
                                data={data?.tables?.featuresTable}
                                columns={[
                                    {
                                        key: "cd",
                                        label: "Code",
                                    },
                                    {
                                        key: "l_dscr",
                                        label: "Description",
                                        render: (row) =>
                                            row.l_dscr ||
                                            row.type_dscr,
                                    },
                                    {
                                        key: "units",
                                        label: "Units",
                                        render: (row) =>
                                            formatNumber(
                                                row.units || row.uts,
                                            ),
                                    },
                                    {
                                        key: "asd_val",
                                        label: "Assessed Value",
                                        render: (row) =>
                                            formatCurrency(
                                                row.asd_val,
                                            ),
                                    },
                                    {
                                        key: "grade",
                                        label: "Grade",
                                    },
                                ]}
                            />
                        </SectionCard>
                    )}

                    {activeTab === "Tax" && (
                        <SectionCard
                            title="Tax Jurisdictions"
                            icon={<Receipt className="h-5 w-5" />}
                        >
                            <DataTable
                                data={data?.tables?.taxTable}
                                columns={[
                                    {
                                        key: "tax_district",
                                        label: "District",
                                    },
                                    {
                                        key: "tp_cd",
                                        label: "Type",
                                    },
                                    {
                                        key: "appraised_val",
                                        label: "Appraised",
                                        render: (row) =>
                                            formatCurrency(
                                                row.appraised_val,
                                            ),
                                    },
                                    {
                                        key: "taxable_val",
                                        label: "Taxable",
                                        render: (row) =>
                                            formatCurrency(
                                                row.taxable_val,
                                            ),
                                    },
                                    {
                                        key: "exempt_cat",
                                        label: "Exemption",
                                    },
                                ]}
                            />
                        </SectionCard>
                    )}

                    {activeTab === "Permits" && (
                        <SectionCard
                            title="Permit Timeline"
                            icon={
                                <CalendarClock className="h-5 w-5" />
                            }
                        >
                            <div className="space-y-5">
                                {data?.timeline?.map(
                                    (item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{
                                                opacity: 0,
                                                x: -10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            className="flex gap-4"
                                        >
                                            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                                <Clock3 className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div className="text-lg font-bold">
                                                        {item.title}
                                                    </div>

                                                    <Badge color="emerald">
                                                        {item.status}
                                                    </Badge>
                                                </div>

                                                <div className="mt-2 text-sm text-slate-600">
                                                    {
                                                        item.description
                                                    }
                                                </div>

                                                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                    <ChevronRight className="h-3 w-3" />
                                                    {item.date}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ),
                                )}
                            </div>
                        </SectionCard>
                    )}

                    {activeTab === "Relationships" && (
                        <SectionCard
                            title="Property Relationships"
                            icon={<Scale className="h-5 w-5" />}
                        >
                            <DataTable
                                data={data?.relationships}
                                columns={[
                                    {
                                        key: "tp",
                                        label: "Type",
                                    },
                                    {
                                        key: "dscr",
                                        label: "Description",
                                    },
                                    {
                                        key: "related_acct",
                                        label: "Related Account",
                                    },
                                    {
                                        key: "pct",
                                        label: "Percentage",
                                    },
                                ]}
                            />
                        </SectionCard>
                    )}
                </div>

                {/* RAW ANALYTICS */}
                <SectionCard
                    title="Enterprise Analytics"
                    icon={<DatabaseIcon  className="h-5 w-5" />}
                >
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Buildings
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {formatNumber(
                                    data?.analytics
                                        ?.totalBuildings,
                                )}
                            </div>
                        </SimpleCard>

                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Land Records
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {formatNumber(
                                    data?.analytics
                                        ?.totalLandRecords,
                                )}
                            </div>
                        </SimpleCard>

                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Features
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {formatNumber(
                                    data?.analytics
                                        ?.totalFeatures,
                                )}
                            </div>
                        </SimpleCard>

                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Jurisdictions
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {formatNumber(
                                    data?.analytics
                                        ?.totalTaxJurisdictions,
                                )}
                            </div>
                        </SimpleCard>

                        <SimpleCard className="p-5">
                            <div className="text-sm text-slate-500">
                                Permits
                            </div>

                            <div className="mt-2 text-3xl font-black">
                                {formatNumber(
                                    data?.analytics
                                        ?.totalPermits,
                                )}
                            </div>
                        </SimpleCard>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}
