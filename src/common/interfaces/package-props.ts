export interface PackageProps {
    id: string;
    name: string;
    type: "BRONZE" | "SILVER" | "GOLD";
    processLimit: number | null;
    price: number;
    isMain: boolean;
    isActive: boolean;
    createdAt: Date;
    deletedAt: Date | null;
}
