import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import {
    Building2,
    Landmark,
    MapPinned,
    DollarSign,
    Map,
    School,
    BriefcaseBusiness,
    ChevronRight, SaveIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import {
    Bookmark,
    BookmarkCheck,
} from "lucide-react";

import { toast } from "sonner";

import {
    saveProperty,
    removeSavedProperty,
    checkSavedProperty,
} from "@/services/saved-property.service";

const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value || 0);
};

const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value || 0);
};

export default function PropertyPreviewSheet({
                                                 open,
                                                 onOpenChange,
                                                 property,
                                                 onPropertySaved,
                                                 onPropertyRemoved,
                                             }) {

    const [isSaved, setIsSaved] =
        useState(false);

    const [saveLoading, setSaveLoading] =
        useState(false);

    const checkPropertySaved =
        async () => {
            try {
                const response =
                    await checkSavedProperty(
                        property.acct
                    );

                setIsSaved(
                    response.data.is_saved
                );
            } catch (error) {
                console.error(error);
            }
        };

    useEffect(() => {
        if (!property?.acct) return;

        checkPropertySaved();
    }, [property?.acct]);


    const handleSaveToggle =
        async () => {
            try {
                setSaveLoading(true);

                if (isSaved) {
                    await removeSavedProperty(
                        property.acct
                    );

                    setIsSaved(false);

                    if (onPropertyRemoved) {
                        onPropertyRemoved(
                            property.acct
                        );
                    }

                    toast.success(
                        "Property removed from saved"
                    );
                }
                else {
                    await saveProperty(
                        property.acct
                    );

                    setIsSaved(true);

                    if (onPropertySaved) {
                        onPropertySaved(
                            property.acct
                        );
                    }

                    toast.success(
                        "Property saved successfully"
                    );
                }
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Something went wrong"
                );
            } finally {
                setSaveLoading(false);
            }
        };

    if (!property) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-[420px] sm:w-[540px] p-0 border-l bg-background overflow-hidden duration-300"
            >
                <div className="flex flex-col h-full">

                    {/* HEADER */}
                    <div className="border-b px-6 py-5 bg-muted/30">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold leading-tight text-foreground">
                                {property.property_address}
                            </h2>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Account:</span>

                                <span className="font-medium text-foreground">
                                    {property.acct}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto">

                        <div className="p-6 space-y-6">

                            {/* VALUE CARD */}
                            <div className="rounded-2xl border bg-card shadow-sm p-5">

                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="h-5 w-5 text-muted-foreground" />

                                    <h3 className="font-semibold text-base">
                                        Valuation Summary
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Market Value
                                        </p>

                                        <h4 className="text-3xl font-bold tracking-tight">
                                            {formatCurrency(property.market_value)}
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">

                                        <div className="rounded-xl bg-muted/50 p-4">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                Building Area
                                            </p>

                                            <p className="font-semibold">
                                                {formatNumber(property.building_area)} SqFt
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-muted/50 p-4">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                Land Area
                                            </p>

                                            <p className="font-semibold">
                                                {formatNumber(property.land_area)} SqFt
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* CLASSIFICATION */}
                            <div className="rounded-2xl border bg-card shadow-sm p-5">

                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 className="h-5 w-5 text-muted-foreground" />

                                    <h3 className="font-semibold text-base">
                                        Classification
                                    </h3>
                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            State Class
                                        </p>

                                        <p className="font-medium">
                                            {property.state_class}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Market Area
                                        </p>

                                        <p className="font-medium">
                                            {property.filters?.market_area || "-"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* OWNERSHIP */}
                            <div className="rounded-2xl border bg-card shadow-sm p-5">

                                <div className="flex items-center gap-2 mb-4">
                                    <Landmark className="h-5 w-5 text-muted-foreground" />

                                    <h3 className="font-semibold text-base">
                                        Ownership
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Owner
                                    </p>

                                    <p className="font-medium leading-relaxed">
                                        {property.owner_name}
                                    </p>
                                </div>

                            </div>

                            {/* QUICK METADATA */}
                            <div className="rounded-2xl border bg-card shadow-sm p-5">

                                <div className="flex items-center gap-2 mb-4">
                                    <MapPinned className="h-5 w-5 text-muted-foreground" />

                                    <h3 className="font-semibold text-base">
                                        Quick Metadata
                                    </h3>
                                </div>

                                <div className="space-y-4">

                                    <div className="flex items-start gap-3">
                                        <Map className="h-4 w-4 mt-1 text-muted-foreground" />

                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Neighborhood
                                            </p>

                                            <p className="font-medium">
                                                {property.filters?.neighborhood || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <School className="h-4 w-4 mt-1 text-muted-foreground" />

                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                County
                                            </p>

                                            <p className="font-medium">
                                                {property.county || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <BriefcaseBusiness className="h-4 w-4 mt-1 text-muted-foreground" />

                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Mailing Address
                                            </p>

                                            <p className="font-medium leading-relaxed">
                                                {property.mailing_address || "-"}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="border-t bg-background p-5">

                        <div className="flex items-center gap-3">

                            <Button
                                className="flex-1"
                                size="lg"
                            >
                                <Link
                                    to={`/admin/property/${property._id}`}
                                    state={{
                                        breadcrumb:
                                            property.property_address
                                                ?.split(",")[0]
                                                ?.trim(),
                                    }}
                                    className="flex"
                                >
                                    <span>View Full Details</span>

                                    <ChevronRight className="ml-1 h-4 w-4 mt-0.5" />
                                </Link>
                            </Button>

                            {/*<Button*/}
                            {/*    size="lg"*/}
                            {/*    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"*/}
                            {/*>*/}
                            {/*    Save Property*/}
                            {/*    <SaveIcon className="h-4 w-4 ml-1" />*/}
                            {/*</Button>*/}
                            <Button
                                size="lg"
                                disabled={saveLoading}
                                onClick={handleSaveToggle}
                                className={`flex-1 text-white cursor-pointer ${
                                    isSaved
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-amber-500 hover:bg-amber-600"
                                }`}
                            >
                                {isSaved
                                    ? "Remove From Saved"
                                    : "Save Property"}

                                {isSaved ? (
                                    <BookmarkCheck className="ml-1 h-4 w-4" />
                                ) : (
                                    <Bookmark className="ml-1 h-4 w-4" />
                                )}
                            </Button>

                            {/*<Button*/}
                            {/*    variant="outline"*/}
                            {/*    size="lg"*/}
                            {/*>*/}
                            {/*    Compare*/}
                            {/*</Button>*/}

                        </div>

                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
