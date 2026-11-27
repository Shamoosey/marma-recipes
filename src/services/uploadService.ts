import type { BaseResponse } from "@/types/BaseResponse";

export interface UploadSignature {
  uploadUrl: string;
  key: string;
  url: string;
  headers: Record<string, string>;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

async function getUploadSignature(file: Blob, sessionToken: string) {
  const res = await fetch(`${BASE_URL}/uploads/sign`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to get upload signature");
  }

  const json: BaseResponse<UploadSignature> = await res.json();
  return json.data;
}

export async function uploadImage(file: Blob, sessionToken: string) {
  const sig = await getUploadSignature(file, sessionToken);

  const res = await fetch(sig.uploadUrl, { method: "PUT", headers: sig.headers, body: file });

  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  return { imageUrl: sig.url, imageKey: sig.key };
}
