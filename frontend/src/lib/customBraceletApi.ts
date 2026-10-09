import {
  FALLBACK_CUSTOM_PRODUCT,
  type AstrologyDetails,
  type CustomBraceletProduct,
} from "../data/Custombracelet";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

/** Server component se call hota hai. Backend down ho to fallback, page crash nahi hota. */
export async function fetchCustomProduct(): Promise<CustomBraceletProduct> {
  try {
    const res = await fetch(`${API}/custom-bracelet/product`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load");
    return await res.json();
  } catch {
    return FALLBACK_CUSTOM_PRODUCT;
  }
}

/** status 0 = network error, 4xx = server ne data reject kiya, 5xx = server problem. */
export class SubmitError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface SubmitResult {
  id: string;
  reference: string;
}

export async function submitCustomRequest(input: {
  details: AstrologyDetails;
  file: File | null;
  submissionId: string;
}): Promise<SubmitResult> {
  const { details, file, submissionId } = input;

  const form = new FormData();
  form.append("details", JSON.stringify({ ...details, submissionId }));
  if (file) form.append("kundli", file);

  let res: Response;
  try {
    // Content-Type manually mat set karo, browser boundary khud lagata hai.
    res = await fetch(`${API}/custom-bracelet/requests`, { method: "POST", body: form });
  } catch {
    throw new SubmitError("Network error", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new SubmitError(data.message || "Could not save your details.", res.status);
  return data as SubmitResult;
}