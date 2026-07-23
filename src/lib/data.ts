export type StatusKind = "ready" | "shared";
export type ManifestType = "Image" | "Image Index";

export interface Digest {
  /** Stable unique key (the on-screen short digest can repeat across rows). */
  id: string;
  /** Short display digest, e.g. "sha256:89f3b..a1". */
  digest: string;
  tags: string[];
  /** Count shown as "+N more" after the visible tags. */
  extraTags?: number;
  manifestType: ManifestType;
  /** e.g. "linux/amd64" or "-" when not applicable. */
  osArch: string;
  sizeMB: number;
  lastPushed: string;
  lastPulled: string;
  status: StatusKind;
  /** Number of shared layers when status === "shared". */
  sharedLayers?: number;
  /** Short digest that references this one; both must be deleted together. */
  referencedBy?: string;
}

export interface SuggestedItem {
  id: string;
  digest: string;
  sizeMB: number;
  lastPushed: string;
  tag: string;
}

/** Total repository storage quota, in MB (5 GB). */
export const STORAGE_TOTAL_MB = 5 * 1024;

export type Category = "active" | "ready" | "partial";

export const STAT_COUNTS: Record<Category, number> = {
  active: 466,
  ready: 375,
  partial: 232,
};

/**
 * Storage held by active (in-use) images that are counted in the summary but
 * not individually listed as deletable. Fixed — deletions never touch it.
 */
export const ACTIVE_STORAGE_MB = 1536; // 1.5 GB

export const suggestedCleanup: SuggestedItem[] = [
  { id: "s1", digest: "sha256:89f3b..f8", sizeMB: 250, lastPushed: "10 years ago", tag: "latest" },
  { id: "s2", digest: "sha256:56g9v..d6", sizeMB: 101, lastPushed: "6 years ago", tag: "v2.29.2" },
  { id: "s3", digest: "sha256:f6h76..j9", sizeMB: 76, lastPushed: "5 years ago", tag: "backup" },
  { id: "s4", digest: "sha256:66k1a..a2", sizeMB: 23, lastPushed: "5 years ago", tag: "legacy" },
];

export const digests: Digest[] = [
  {
    id: "d1",
    digest: "sha256:89f3b..a1",
    tags: ["v1.0", "v1.1"],
    manifestType: "Image",
    osArch: "-",
    sizeMB: 1843,
    lastPushed: "3 years ago",
    lastPulled: "11 months ago",
    status: "ready",
  },
  {
    id: "d2",
    digest: "sha256:5af7b..b9",
    tags: ["backup"],
    manifestType: "Image",
    osArch: "linux/amd64",
    sizeMB: 585,
    lastPushed: "3 years ago",
    lastPulled: "11 months ago",
    status: "ready",
  },
  {
    id: "d3",
    digest: "sha256:c2e8a..d4",
    tags: ["v2.29.2", "latest"],
    manifestType: "Image",
    osArch: "linux/arm64",
    sizeMB: 1229,
    lastPushed: "3 years ago",
    lastPulled: "1 year ago",
    status: "ready",
    referencedBy: "sha256:4f2d3..f2",
  },
  {
    id: "d4",
    digest: "sha256:92a8f..c3",
    tags: ["legacy"],
    manifestType: "Image",
    osArch: "-",
    sizeMB: 19,
    lastPushed: "2 years ago",
    lastPulled: "4 months ago",
    status: "ready",
  },
  {
    id: "d5",
    digest: "sha256:bc1e4..a8",
    tags: ["v1.2.3", "stable"],
    manifestType: "Image",
    osArch: "-",
    sizeMB: 13,
    lastPushed: "2 years ago",
    lastPulled: "8 months ago",
    status: "shared",
    sharedLayers: 3,
  },
  {
    id: "d6",
    digest: "sha256:4f2d3..f2",
    tags: ["test", "beta"],
    manifestType: "Image Index",
    osArch: "-",
    sizeMB: 113,
    lastPushed: "1 year ago",
    lastPulled: "3 months ago",
    status: "shared",
    sharedLayers: 2,
  },
  {
    id: "d7",
    digest: "sha256:a3d1f..b6",
    tags: ["nightly", "beta", "hotfix"],
    manifestType: "Image",
    osArch: "linux/amd64",
    sizeMB: 10,
    lastPushed: "1 year ago",
    lastPulled: "7 months ago",
    status: "ready",
  },
  {
    id: "d8",
    digest: "sha256:cb8f7..d7",
    tags: ["v1.1.1-patch"],
    manifestType: "Image",
    osArch: "linux/arm64",
    sizeMB: 27,
    lastPushed: "1 year ago",
    lastPulled: "7 months ago",
    status: "shared",
    sharedLayers: 1,
  },
  {
    id: "d9",
    digest: "sha256:ae6c9..f4",
    tags: ["dev-preview"],
    manifestType: "Image",
    osArch: "linux/arm/v7",
    sizeMB: 45,
    lastPushed: "1 year ago",
    lastPulled: "9 months ago",
    status: "ready",
  },
  {
    id: "d10",
    digest: "sha256:c2e8a..d4",
    tags: ["v2.29.2", "latest"],
    extraTags: 3,
    manifestType: "Image",
    osArch: "linux/arm64",
    sizeMB: 130,
    lastPushed: "9 months ago",
    lastPulled: "6 months ago",
    status: "ready",
  },
  {
    id: "d11",
    digest: "sha256:c2e8a..d4",
    tags: ["v2.29.2", "latest"],
    extraTags: 3,
    manifestType: "Image",
    osArch: "linux/arm64",
    sizeMB: 59,
    lastPushed: "9 months ago",
    lastPulled: "1 year ago",
    status: "ready",
  },
  {
    id: "d12",
    digest: "sha256:c2e8a..d4",
    tags: ["v2.29.2", "latest"],
    extraTags: 3,
    manifestType: "Image",
    osArch: "linux/arm64",
    sizeMB: 115,
    lastPushed: "8 months ago",
    lastPulled: "11 months ago",
    status: "ready",
  },
];

/** Format a size in MB the way the product does: GB (1 decimal) above 1024 MB. */
export function formatSize(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return `${gb >= 10 ? Math.round(gb) : gb.toFixed(1)} GB`;
  }
  return `${Math.round(mb)} MB`;
}

export const statusLabel = (d: Pick<Digest, "status" | "sharedLayers">) =>
  d.status === "ready"
    ? "Ready for deletion"
    : `${d.sharedLayers} shared layer${d.sharedLayers === 1 ? "" : "s"}`;

/** Which storage/metric category a digest belongs to. */
export const categoryOf = (d: Pick<Digest, "status">): Category =>
  d.status === "ready" ? "ready" : "partial";
