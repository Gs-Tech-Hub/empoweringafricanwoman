import { createClient } from "@supabase/supabase-js";
import { Readable } from "stream";

function getSupabaseAuthKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    null
  );
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const authKey = getSupabaseAuthKey();

  if (!supabaseUrl || !authKey) {
    throw new Error(
      "Supabase storage credentials are not configured. Add SUPABASE_SERVICE_ROLE_KEY for server uploads, or SUPABASE_ANON_KEY with an anon insert policy."
    );
  }

  console.log("[supabase] using storage auth mode", {
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasAnonKey: Boolean(process.env.SUPABASE_ANON_KEY),
    hasPublishableKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  });

  return createClient(supabaseUrl, authKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getBucketName() {
  return process.env.NEXT_PUBLIC_SUPABASE_BUCKET || process.env.SUPABASE_BUCKET || "images";
}

function getRlsErrorMessage() {
  return "Supabase storage upload is blocked by RLS. Add SUPABASE_SERVICE_ROLE_KEY to the server environment or configure an insert policy for the bucket.";
}

function sanitizeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${baseName || "image"}${extension ? `.${extension}` : ""}`;
}

function buildStoragePath(fileName: string) {
  return `${Date.now()}-${sanitizeFileName(fileName)}`;
}

export async function uploadFileToSupabase(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
) {
  const supabase = getSupabaseClient();
  const bucket = getBucketName();
  const filePath = buildStoragePath(fileName);

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
    contentType: mimeType,
    cacheControl: "3600",
    upsert: false,
  });

  if (error || !data?.path) {
    const message = error?.message ?? "Failed to upload media to Supabase storage";
    const detailedMessage = message.includes("row-level security policy")
      ? getRlsErrorMessage()
      : message;

    throw new Error(detailedMessage);
  }

  return {
    fileId: data.path,
    fileName,
  };
}

export async function deleteFileFromSupabase(fileId: string) {
  const supabase = getSupabaseClient();
  const bucket = getBucketName();
  const { error } = await supabase.storage.from(bucket).remove([fileId]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getFileStreamFromSupabase(fileId: string) {
  const supabase = getSupabaseClient();
  const bucket = getBucketName();
  const { data, error } = await supabase.storage.from(bucket).download(fileId);

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to read media from storage");
  }

  const arrayBuffer = await data.arrayBuffer();
  return Readable.from(Buffer.from(arrayBuffer));
}

export async function getFileMetadataFromSupabase(fileId: string) {
  const supabase = getSupabaseClient();
  const bucket = getBucketName();
  const { data, error } = await supabase.storage.from(bucket).download(fileId);

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to read media metadata from storage");
  }

  return {
    mimeType: data.type || "application/octet-stream",
    name: fileId,
  };
}

export function isSupabaseConfigured() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const authKey = getSupabaseAuthKey();

  return Boolean(supabaseUrl && authKey);
}

export function hasSupabaseServiceRoleKey() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
