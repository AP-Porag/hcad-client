import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Treemap,
} from "recharts";

import {
    Activity,
    Building2,
    DollarSign,
    Landmark,
    Layers3,
    MapPinned,
    TrendingUp,
    Trophy,
    Warehouse,
    Sparkles,
    ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    formatCurrency,
    formatNumber,
} from "@/lib/format";

import {
    PROPERTY_STATE_CLASS,
} from "@/constants/property-state-class";

import { API_BASE_URL } from "@/config/api";

export default function MarketInsight() {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState({
        neighborhoodAnalytics: [],
        stateClassAnalytics: [],
        marketAreaAnalytics: [],
        landVsBuildingAnalytics: [],
        topValuedProperties: [],
        topLargestBuildings: [],
        heatmapData: [],
    });

    const [marketLimit, setMarketLimit] = useState("10");

    const fetchInsights = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/market-insight`
            );

            setData(response.data || {});

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchInsights();

    }, []);

    const summary = useMemo(() => {

        const totalMarketValue =
            data.marketAreaAnalytics?.reduce(
                (acc, item) => acc + (item.totalMarketValue || 0),
                0
            ) || 0;

        const totalProperties =
            data.stateClassAnalytics?.reduce(
                (acc, item) => acc + (item.propertyCount || 0),
                0
            ) || 0;

        const avgPropertyValue =
            totalProperties > 0
                ? totalMarketValue / totalProperties
                : 0;

        const topMarket =
            data.marketAreaAnalytics?.[0]?._id || "-";

        return {
            totalMarketValue,
            totalProperties,
            avgPropertyValue,
            topMarket,
        };

    }, [data]);

    const marketAreaChartData = useMemo(() => {

        return (
            data.marketAreaAnalytics
                ?.slice(0, Number(marketLimit))
                ?.map((item) => ({
                    name:
                        item._id?.length > 22
                            ? item._id.slice(0, 22) + "..."
                            : item._id,
                    value: item.totalMarketValue,
                    avg: item.avgMarketValue,
                    properties: item.propertyCount,
                })) || []
        );

    }, [data, marketLimit]);

    const stateClassChartData = useMemo(() => {

        return (
            data.stateClassAnalytics?.map((item) => ({
                name:
                    PROPERTY_STATE_CLASS[item._id] ||
                    item._id,
                code: item._id,
                value: item.propertyCount,
                avg: item.avgMarketValue,
            })) || []
        );

    }, [data]);

    const heatmapCards = useMemo(() => {

        return data.heatmapData || [];

    }, [data]);

    if (loading) {

        return (
            <div className="flex min-h-[80vh] items-center justify-center">

                <div className="flex flex-col items-center gap-4">

                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />

                    <p className="text-sm font-medium text-slate-500">
                        Loading market intelligence...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HERO */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                    overflow-hidden rounded-[32px]
                    bg-gradient-to-br
                    from-[#020617]
                    via-[#071133]
                    to-[#0f172a]
                    p-8
                    text-white
                    shadow-2xl
                "
            >

                <div className="grid gap-8 xl:grid-cols-2">

                    {/* LEFT */}

                    <div className="space-y-6">

                        <div className="flex flex-wrap items-center gap-3">

                            <Badge className="bg-blue-600 hover:bg-blue-600">
                                HCAD Analytics
                            </Badge>

                            <Badge className="bg-emerald-600 hover:bg-emerald-600">
                                Houston Property Intelligence
                            </Badge>

                            <Badge className="bg-purple-600 hover:bg-purple-600">
                                Market Overview
                            </Badge>

                        </div>

                        <div>

                            <h1 className="text-5xl font-black tracking-tight">
                                Market Insight
                            </h1>

                            <p className="mt-4 max-w-2xl text-slate-300 leading-7">
                                Analyze Houston property valuation trends,
                                neighborhood performance, ownership concentration,
                                and market segmentation using live HCAD data intelligence.
                            </p>

                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">

                                <p className="text-sm text-slate-400">
                                    Total Market Value
                                </p>

                                <h2 className="mt-3 text-4xl font-black">
                                    {formatCurrency(summary.totalMarketValue)}
                                </h2>

                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">

                                <p className="text-sm text-slate-400">
                                    Avg Property Value
                                </p>

                                <h2 className="mt-3 text-4xl font-black">
                                    {formatCurrency(summary.avgPropertyValue)}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="grid gap-4 md:grid-cols-2">

                        <InsightCard
                            icon={<Building2 className="h-5 w-5" />}
                            title="Total Properties"
                            value={`${(summary.totalProperties / 1000000).toFixed(2)}M`}
                            gradient="from-blue-600 to-blue-500"
                        />

                        <InsightCard
                            icon={<TrendingUp className="h-5 w-5" />}
                            title="Highest Value Market"
                            value={summary.topMarket}
                            gradient="from-emerald-600 to-green-500"
                        />

                        <InsightCard
                            icon={<MapPinned className="h-5 w-5" />}
                            title="Neighborhood Clusters"
                            value={`${data.neighborhoodAnalytics?.length || 0} Zones`}
                            gradient="from-orange-500 to-red-500"
                        />

                        <InsightCard
                            icon={<Layers3 className="h-5 w-5" />}
                            title="Active Market Areas"
                            value={`${data.marketAreaAnalytics?.length || 0} Areas`}
                            gradient="from-purple-600 to-fuchsia-600"
                        />

                    </div>

                </div>

            </motion.div>

            {/* FILTERS */}

            <Card className="rounded-3xl border-0 shadow-sm">

                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Analytics Controls
                        </h2>

                        <p className="text-sm text-slate-500">
                            Explore aggregated market intelligence
                        </p>

                    </div>

                    <Select
                        value={marketLimit}
                        onValueChange={setMarketLimit}
                    >

                        <SelectTrigger className="w-[180px] rounded-xl">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="5">
                                Top 5 Markets
                            </SelectItem>

                            <SelectItem value="10">
                                Top 10 Markets
                            </SelectItem>

                            <SelectItem value="15">
                                Top 15 Markets
                            </SelectItem>

                            <SelectItem value="20">
                                Top 20 Markets
                            </SelectItem>

                        </SelectContent>

                    </Select>

                </CardContent>

            </Card>

            {/* CHARTS */}

            <div className="grid gap-6 xl:grid-cols-2">

                {/* MARKET VALUE */}

                <Card className="rounded-3xl border-0 shadow-sm">

                    <CardContent className="p-6">

                        <div className="mb-6 flex items-center gap-3">

                            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                                <DollarSign className="h-5 w-5" />
                            </div>

                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Market Value Distribution
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Total market value by market area
                                </p>

                            </div>

                        </div>

                        <div className="h-[380px]">

                            <ResponsiveContainer width="100%" height="100%">

                                <AreaChart data={marketAreaChartData}>

                                    <defs>

                                        <linearGradient
                                            id="colorValue"
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
                                        dataKey="name"
                                        tick={{ fontSize: 10 }}
                                    />

                                    <YAxis
                                        tickFormatter={(value) => {

                                            if (value >= 1000000000) {
                                                return `$${(value / 1000000000).toFixed(0)}B`;
                                            }

                                            if (value >= 1000000) {
                                                return `$${(value / 1000000).toFixed(0)}M`;
                                            }

                                            return value;
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            formatCurrency(value)
                                        }
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#2563eb"
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        strokeWidth={3}
                                    />

                                </AreaChart>

                            </ResponsiveContainer>

                        </div>

                    </CardContent>

                </Card>

                {/* TREEMAP */}

                <Card className="rounded-3xl border-0 shadow-sm">

                    <CardContent className="p-6">

                        <div className="mb-6 flex items-center gap-3">

                            <div className="rounded-xl bg-purple-100 p-2 text-purple-700">
                                <Activity className="h-5 w-5" />
                            </div>

                            <div>

                                <h2 className="font-bold text-slate-900">
                                    State Class Intelligence
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Property composition by classification
                                </p>

                            </div>

                        </div>

                        <div className="h-[380px]">

                            <ResponsiveContainer width="100%" height="100%">

                                <Treemap
                                    data={stateClassChartData}
                                    dataKey="value"
                                    stroke="#ffffff"
                                    fill="#2563eb"
                                    content={(props) => {

                                        const {
                                            x,
                                            y,
                                            width,
                                            height,
                                            index,
                                            root,
                                        } = props;

                                        const payload = root;

                                        if (!payload) return null;

                                        const colors = [
                                            "#2563eb",
                                            "#7c3aed",
                                            "#ea580c",
                                            "#059669",
                                            "#dc2626",
                                            "#0891b2",
                                            "#9333ea",
                                            "#0f172a",
                                        ];

                                        return (
                                            <g>

                                                <rect
                                                    x={x}
                                                    y={y}
                                                    width={width}
                                                    height={height}
                                                    style={{
                                                        fill: colors[index % colors.length],
                                                        stroke: "#fff",
                                                        strokeWidth: 3,
                                                    }}
                                                    rx={14}
                                                />

                                                {width > 80 && height > 50 && (
                                                    <>
                                                        <text
                                                            x={x + 12}
                                                            y={y + 28}
                                                            fill="#fff"
                                                            fontSize={14}
                                                            fontWeight={700}
                                                        >
                                                            {payload.name}
                                                        </text>

                                                        <text
                                                            x={x + 12}
                                                            y={y + 50}
                                                            fill="rgba(255,255,255,0.8)"
                                                            fontSize={12}
                                                        >
                                                            {formatNumber(payload.value)} Properties
                                                        </text>
                                                    </>
                                                )}

                                            </g>
                                        );
                                    }}
                                >

                                    <Tooltip />

                                </Treemap>

                            </ResponsiveContainer>

                        </div>

                    </CardContent>

                </Card>

            </div>

            {/* HEATMAP */}

            <Card className="rounded-3xl border-0 shadow-sm">

                <CardContent className="p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
                            <Landmark className="h-5 w-5" />
                        </div>

                        <div>

                            <h2 className="font-bold text-slate-900">
                                Neighborhood Heatmap
                            </h2>

                            <p className="text-sm text-slate-500">
                                High-intensity market clusters
                            </p>

                        </div>

                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                        {heatmapCards.map((item, index) => (

                            <motion.div
                                key={index}
                                whileHover={{
                                    y: -5,
                                    scale: 1.02,
                                }}
                                className={`
                                    rounded-3xl
                                    p-5
                                    shadow-xl
                                    text-white
                                    relative
                                    overflow-hidden
                                    ${
                                    index % 6 === 0
                                        ? "bg-gradient-to-br from-blue-600 to-cyan-500"
                                        : index % 6 === 1
                                            ? "bg-gradient-to-br from-purple-600 to-fuchsia-500"
                                            : index % 6 === 2
                                                ? "bg-gradient-to-br from-orange-500 to-red-500"
                                                : index % 6 === 3
                                                    ? "bg-gradient-to-br from-emerald-600 to-green-500"
                                                    : index % 6 === 4
                                                        ? "bg-gradient-to-br from-pink-600 to-rose-500"
                                                        : "bg-gradient-to-br from-slate-800 to-slate-600"
                                }
                                `}
                            >

                                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

                                <div className="relative z-10">

                                    <div className="flex items-center justify-between">

                                        <Badge className="rounded-full border-0 bg-white/20 text-white hover:bg-white/20">
                                            Neighborhood {item.neighborhood}
                                        </Badge>

                                        <Sparkles className="h-4 w-4 text-white" />

                                    </div>

                                    <h3 className="mt-6 text-3xl font-black">
                                        {formatCurrency(item.intensity)}
                                    </h3>

                                    <p className="mt-1 text-sm text-white/70">
                                        Total Market Intensity
                                    </p>

                                    <div className="mt-6 flex items-center justify-between">

                                        <div>

                                            <p className="text-xs text-white/70">
                                                Properties
                                            </p>

                                            <p className="text-lg font-black">
                                                {formatNumber(item.propertyCount)}
                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-xs text-white/70">
                                                Avg Value
                                            </p>

                                            <p className="text-lg font-black">
                                                {formatCurrency(item.avgMarketValue)}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </motion.div>

                        ))}

                    </div>

                </CardContent>

            </Card>

            {/* TABLES */}

            <Tabs
                defaultValue="valued"
                className="space-y-6"
            >

                <TabsList className="rounded-2xl">

                    <TabsTrigger value="valued">
                        Top Valued
                    </TabsTrigger>

                    <TabsTrigger value="largest">
                        Largest Buildings
                    </TabsTrigger>

                </TabsList>

                {/* TOP VALUED */}

                <TabsContent value="valued">

                    <Card className="rounded-3xl border-0 shadow-sm">

                        <CardContent className="p-0">

                            <div className="border-b p-6">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                                        <Trophy className="h-5 w-5" />
                                    </div>

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            Highest Valued Properties
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Premium property intelligence rankings
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="overflow-x-auto">

                                <Table>

                                    <TableHeader>

                                        <TableRow>

                                            <TableHead>
                                                Property
                                            </TableHead>

                                            <TableHead>
                                                Owner
                                            </TableHead>

                                            <TableHead>
                                                State Class
                                            </TableHead>

                                            <TableHead>
                                                Market Value
                                            </TableHead>

                                        </TableRow>

                                    </TableHeader>

                                    <TableBody>

                                        {data.topValuedProperties?.map((item) => (

                                            <TableRow key={item._id}>

                                                <TableCell className="min-w-[320px]">

                                                    <div>

                                                        <p className="font-semibold text-slate-900">
                                                            {item.property_address}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Account: {item.acct}
                                                        </p>

                                                    </div>

                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    {item.owner_name}
                                                </TableCell>

                                                <TableCell>

                                                    <Badge variant="secondary">
                                                        {
                                                            PROPERTY_STATE_CLASS[
                                                                item.state_class
                                                                ] || item.state_class
                                                        }
                                                    </Badge>

                                                </TableCell>

                                                <TableCell className="font-black text-emerald-600">
                                                    {formatCurrency(item.market_value)}
                                                </TableCell>

                                            </TableRow>

                                        ))}

                                    </TableBody>

                                </Table>

                            </div>

                        </CardContent>

                    </Card>

                </TabsContent>

                {/* LARGEST */}

                <TabsContent value="largest">

                    <Card className="rounded-3xl border-0 shadow-sm">

                        <CardContent className="p-0">

                            <div className="border-b p-6">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700">
                                        <Warehouse className="h-5 w-5" />
                                    </div>

                                    <div>

                                        <h2 className="font-bold text-slate-900">
                                            Largest Buildings
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Commercial-scale building intelligence
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="overflow-x-auto">

                                <Table>

                                    <TableHeader>

                                        <TableRow>

                                            <TableHead>
                                                Property
                                            </TableHead>

                                            <TableHead>
                                                Building Area
                                            </TableHead>

                                            <TableHead>
                                                Market Value
                                            </TableHead>

                                        </TableRow>

                                    </TableHeader>

                                    <TableBody>

                                        {data.topLargestBuildings?.map((item) => (

                                            <TableRow key={item._id}>

                                                <TableCell className="min-w-[320px]">

                                                    <div>

                                                        <p className="font-semibold text-slate-900">
                                                            {item.property_address}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {item.owner_name}
                                                        </p>

                                                    </div>

                                                </TableCell>

                                                <TableCell className="font-bold text-indigo-600">
                                                    {formatNumber(item.building_area)} SqFt
                                                </TableCell>

                                                <TableCell className="font-black text-emerald-600">
                                                    {formatCurrency(item.market_value)}
                                                </TableCell>

                                            </TableRow>

                                        ))}

                                    </TableBody>

                                </Table>

                            </div>

                        </CardContent>

                    </Card>

                </TabsContent>

            </Tabs>

            {/* FUTURE */}

            <Card className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 shadow-none">

                <CardContent className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Future Expansion Opportunities
                        </h2>

                        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                            Additional enterprise analytics modules such as AI forecasting,
                            predictive valuation modeling, GIS visualization,
                            investment scoring, and advanced trend intelligence
                            can be included in future project phases.
                        </p>

                    </div>

                    {/*<Button className="rounded-xl">*/}
                    {/*    Future Roadmap*/}
                    {/*    <ChevronRight className="ml-2 h-4 w-4" />*/}
                    {/*</Button>*/}

                </CardContent>

            </Card>

        </div>
    );
}

/* =========================================================
   INSIGHT CARD
========================================================= */

function InsightCard({
                         icon,
                         title,
                         value,
                         gradient,
                     }) {

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`
                rounded-3xl bg-gradient-to-br ${gradient}
                p-6 text-white shadow-xl
            `}
        >

            <div className="flex items-center justify-between">

                <div className="rounded-xl bg-white/20 p-3">
                    {icon}
                </div>

                <Badge className="bg-white/20 text-white hover:bg-white/20">
                    Live
                </Badge>

            </div>

            <div className="mt-10">

                <p className="text-sm text-white/70">
                    {title}
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight">
                    {value}
                </h2>

            </div>

        </motion.div>
    );
}
