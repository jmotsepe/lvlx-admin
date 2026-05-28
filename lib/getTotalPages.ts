export const pageSize = 40;

// This is used for pagination purposes, the default page size is 40
export default function getTotalPages(totalCount: number): number {
  return Math.ceil(totalCount / pageSize);
}
