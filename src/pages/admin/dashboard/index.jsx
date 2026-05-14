import { useEffect, useState } from "react";

import axios from "axios";

import CountUpModule from "react-countup";
const CountUp = CountUpModule.default || CountUpModule;

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import {
    Building2,
    DollarSign,
    LandPlot,
    Warehouse,
    Activity,
    TrendingUp,
    PieChartIcon,
    Shield,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Badge,
} from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    formatCompactCurrency, formatCompactNumber,
    formatCurrency,
    formatNumber,
} from "@/lib/format";

import {
    PROPERTY_STATE_CLASS,
} from "@/constants/property-state-class";

import {
    API_BASE_URL,
} from "@/config/api";

const CHART_COLORS = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#ea580c",
    "#dc2626",
    "#0891b2",
    "#4338ca",
    "#16a34a",
];

export default function Index() {

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState(null);

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/dashboard`
            );

            setDashboard(response.data);
        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">

                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"
                />

            </div>
        );
    }

    const overview = dashboard?.overview || {};

    const stateClassData =
        dashboard?.stateClassBreakdown || [];

    const marketAreaData =
        dashboard?.marketAreaBreakdown || [];

    const marketValueDistribution =
        dashboard?.marketValueDistribution || [];

    const ownershipDuration =
        dashboard?.ownershipDuration || [];

    const taxCollectionSummary =
        dashboard?.taxCollectionSummary || [];

    const recentActivity =
        dashboard?.recentActivity || [];

    return (

        <div className="space-y-8">

            {/* HERO */}

            <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#020617] via-[#071133] to-[#0f172a] p-8 text-white shadow-2xl">

                <div className="grid gap-6 xl:grid-cols-4">

                    <HeroStat
                        title="Total Properties"
                        value={formatNumber(
                            overview.totalProperties || 0
                        )}
                        icon={<Building2 className="h-5 w-5" />}
                    />

                    <HeroStat
                        title="Average Market Value"
                        value={formatCompactCurrency(
                            overview.avgMarketValue || 0
                        )}
                        icon={<TrendingUp className="h-5 w-5" />}
                    />

                    <HeroStat
                        title="Total Market Value"
                        value={formatCompactCurrency(
                            overview.totalMarketValue || 0
                        )}
                        icon={<DollarSign className="h-5 w-5" />}
                    />

                    <HeroStat
                        title="Market Segments"
                        value={stateClassData.length}
                        icon={<PieChartIcon className="h-5 w-5" />}
                    />

                </div>

            </div>

            {/* HERO */}

            {/* KPI GRID */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">

                {/*<KpiCard*/}
                {/*    title="Total Properties"*/}
                {/*    value={overview.totalProperties}*/}
                {/*    icon={<Building2 className="h-6 w-6" />}*/}
                {/*    prefix=""*/}
                {/*/>*/}

                {/*<KpiCard*/}
                {/*    title="Total Market Value"*/}
                {/*    value={overview.totalMarketValue}*/}
                {/*    icon={<DollarSign className="h-6 w-6" />}*/}
                {/*    prefix="$"*/}
                {/*/>*/}

                <KpiCard
                    title="Total Land Area"
                    value={overview.totalLandArea}
                    icon={<LandPlot className="h-6 w-6" />}
                    suffix=" SqFt"
                />

                <KpiCard
                    title="Building Area"
                    value={overview.totalBuildingArea}
                    icon={<Warehouse className="h-6 w-6" />}
                    suffix=" SqFt"
                />

            </div>

            {/* CHART GRID */}

            <div className="grid gap-6 xl:grid-cols-2">

                {/* STATE CLASS */}

                <ChartCard
                    title="State Class Distribution"
                    subtitle="Property segmentation by classification"
                    icon={<PieChartIcon className="h-5 w-5" />}
                >

                    <div className="h-[400px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={stateClassData}
                                    dataKey="count"
                                    nameKey="_id"
                                    innerRadius={80}
                                    outerRadius={140}
                                    paddingAngle={3}
                                >

                                    {
                                        stateClassData.map((entry, index) => (

                                            <Cell
                                                key={index}
                                                fill={
                                                    CHART_COLORS[
                                                    index % CHART_COLORS.length
                                                        ]
                                                }
                                            />

                                        ))
                                    }

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">

                        {
                            stateClassData.map((item, index) => (

                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3"
                                >

                                    <div className="flex items-center gap-3">

                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                background:
                                                    CHART_COLORS[
                                                    index % CHART_COLORS.length
                                                        ],
                                            }}
                                        />

                                        <div>

                                            <p className="font-semibold text-slate-900">
                                                {
                                                    PROPERTY_STATE_CLASS[item._id]
                                                    || item._id
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {item._id}
                                            </p>

                                        </div>

                                    </div>

                                    <Badge variant="secondary">
                                        {formatNumber(item.count)}
                                    </Badge>

                                </div>

                            ))
                        }

                    </div>

                </ChartCard>

                {/* MARKET AREAS */}

                <ChartCard
                    title="Top Market Areas"
                    subtitle="Highest total property value regions"
                    icon={<TrendingUp className="h-5 w-5" />}
                >

                    <div className="h-[520px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart
                                data={marketAreaData}
                                layout="vertical"
                                margin={{
                                    left: 40,
                                    right: 20,
                                }}
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis type="number" hide />

                                <YAxis
                                    dataKey="_id"
                                    type="category"
                                    width={180}
                                    tick={{
                                        fontSize: 12,
                                    }}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="totalValue"
                                    radius={[0, 12, 12, 0]}
                                >
                                    {
                                        marketAreaData.map((entry, index) => (

                                            <Cell
                                                key={index}
                                                fill={
                                                    CHART_COLORS[
                                                    index % CHART_COLORS.length
                                                        ]
                                                }
                                            />

                                        ))
                                    }
                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </ChartCard>

            </div>

            {/* SECOND CHART GRID */}

            <div className="grid gap-6 xl:grid-cols-2">

                {/* VALUE DISTRIBUTION */}

                <ChartCard
                    title="Market Value Distribution"
                    subtitle="Property count by valuation range"
                    icon={<DollarSign className="h-5 w-5" />}
                >

                    <div className="h-[420px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <AreaChart
                                data={marketValueDistribution}
                            >

                                <defs>

                                    <linearGradient
                                        id="marketGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />

                                    </linearGradient>

                                </defs>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="_id"
                                    tickFormatter={(value) =>
                                        `$${formatNumber(value)}`
                                    }
                                />

                                <YAxis />

                                <Tooltip />

                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#marketGradient)"
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </ChartCard>

                {/* OWNERSHIP */}

                <ChartCard
                    title="Ownership Duration"
                    subtitle="Property ownership lifecycle analysis"
                    icon={<Shield className="h-5 w-5" />}
                >

                    <div className="h-[420px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart
                                data={ownershipDuration}
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="_id"
                                    tickFormatter={(value) =>
                                        `${value}+ yrs`
                                    }
                                />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="count"
                                    radius={[12, 12, 0, 0]}
                                >
                                    {
                                        ownershipDuration.map((entry, index) => (

                                            <Cell
                                                key={index}
                                                fill={
                                                    CHART_COLORS[
                                                    index % CHART_COLORS.length
                                                        ]
                                                }
                                            />

                                        ))
                                    }
                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </ChartCard>

            </div>

            {/* TAX + RECENT */}

            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">

                {/* TAX */}

                <Card className="rounded-3xl border-0 shadow-sm">

                    <CardContent className="p-6">

                        <div className="mb-6">

                            <h2 className="text-2xl font-black text-slate-900">
                                Tax Collection Summary
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Top taxable districts
                            </p>

                        </div>

                        <div className="space-y-4">

                            {
                                taxCollectionSummary.map((item, index) => (

                                    <div
                                        key={index}
                                        className="rounded-2xl border bg-slate-50 p-4"
                                    >

                                        <div className="flex items-center justify-between">

                                            <Badge className="bg-slate-900 text-white">
                                                District: {item.districtName}
                                            </Badge>

                                            <p className="text-sm font-semibold text-slate-500">
                                                {formatCompactNumber(item.propertyCount)} Properties
                                            </p>

                                        </div>

                                        <h3 className="mt-4 text-2xl font-black text-slate-900">
                                            {formatCompactCurrency(item.totalTaxableValue)}
                                        </h3>

                                    </div>

                                ))
                            }

                        </div>

                    </CardContent>

                </Card>

                {/* RECENT ACTIVITY */}

                <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">

                    <CardContent className="p-0">

                        <div className="border-b p-6">

                            <div className="flex items-center gap-3">

                                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                                    <Activity className="h-5 w-5" />
                                </div>

                                <div>

                                    <h2 className="text-2xl font-black text-slate-900">
                                        Recent Activity
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Recent permits and property events
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="overflow-x-auto">

                            <Table>

                                <TableHeader>

                                    <TableRow>

                                        <TableHead>Property</TableHead>

                                        <TableHead>Permit</TableHead>

                                        <TableHead>Type</TableHead>

                                        <TableHead>Date</TableHead>

                                        <TableHead>Market Value</TableHead>

                                    </TableRow>

                                </TableHeader>

                                <TableBody>

                                    {
                                        recentActivity.map((item, index) => (

                                            <TableRow key={index}>

                                                <TableCell className="min-w-[260px]">

                                                    <div>

                                                        <p className="font-semibold text-slate-900">
                                                            {item.property_address}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {item.owner_name}
                                                        </p>

                                                    </div>

                                                </TableCell>

                                                <TableCell className="max-w-[280px]">

                                                    <p className="line-clamp-2 text-sm text-slate-700">
                                                        {item.permit_description}
                                                    </p>

                                                </TableCell>

                                                <TableCell>

                                                    <Badge variant="secondary">
                                                        {item.permit_type}
                                                    </Badge>

                                                </TableCell>

                                                <TableCell className="whitespace-nowrap font-medium text-slate-700">
                                                    {item.issue_date}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap font-bold text-emerald-600">
                                                    {formatCurrency(item.market_value)}
                                                </TableCell>

                                            </TableRow>

                                        ))
                                    }

                                </TableBody>

                            </Table>

                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}

function HeroStat({
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

            <div className="mt-8">

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

function KpiCard({
                     title,
                     value,
                     icon,
                     prefix = "",
                     suffix = "",
                 }) {

    return (

        <motion.div
            whileHover={{
                y: -4,
            }}
        >

            <Card className="rounded-3xl border-0 shadow-sm">

                <CardContent className="p-6">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                {title}
                            </p>

                            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">

                                {prefix}

                                {/*<CountUp*/}
                                {/*    end={value || 0}*/}
                                {/*    duration={2}*/}
                                {/*    separator=","*/}
                                {/*/>*/}
                                <CountUp
                                    end={
                                        value || 0
                                    }
                                    formattingFn={(value) =>
                                        formatCompactNumber(value)
                                    }
                                />

                                {suffix}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-slate-100 p-4 text-slate-900">
                            {icon}
                        </div>

                    </div>

                </CardContent>

            </Card>

        </motion.div>
    );
}

function ChartCard({
                       title,
                       subtitle,
                       icon,
                       children,
                   }) {

    return (

        <Card className="rounded-3xl border-0 shadow-sm">

            <CardContent className="p-6">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-black text-slate-900">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {subtitle}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4 text-slate-900">
                        {icon}
                    </div>

                </div>

                {children}

            </CardContent>

        </Card>
    );
}
