/**
 * src/lib/firebase/requests.ts
 * Customer Request & Admin Audit Firebase Service
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";
import { CustomerRequest, RequestStatus, RequestType, AdminAuditLog } from "@/types/cms";

export interface SubmitRequestInput {
  requestType: RequestType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  productId?: string;
  productCode?: string;
  articleNumber?: string;
  productName?: string;
  sourcePage?: string;
  locale?: "tr" | "en";
  honeypot?: string; // Anti-spam hidden field
}

/**
 * Public submission of inquiry/quote form.
 * Strictly adheres to Firestore Security Rules schema:
 * - status forced to 'new'
 * - no admin/role fields
 * - required: name, email, requestType, status, createdAt
 */
export async function submitCustomerRequest(input: SubmitRequestInput): Promise<string> {
  // 1. Honeypot check
  if (input.honeypot && input.honeypot.trim() !== "") {
    // Silently drop bots
    return "req_bot_dropped";
  }

  // 2. Validate input
  const name = input.name?.trim() || "";
  const email = input.email?.trim() || "";
  if (!name || name.length > 200) throw new Error("Invalid name.");
  if (!email || email.length > 200) throw new Error("Invalid email.");

  // 3. Generate clean document ID
  const ref = doc(collection(db, "requests"));
  const requestId = "REQ-" + Math.floor(100000 + Math.random() * 900000);

  // 4. Construct payload strictly matching rules
  const payload: Record<string, any> = {
    requestId,
    requestType: input.requestType || "product_inquiry",
    name,
    email,
    locale: input.locale || "tr",
    status: "new" as RequestStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (input.phone?.trim()) payload.phone = input.phone.trim().slice(0, 50);
  if (input.company?.trim()) payload.company = input.company.trim().slice(0, 100);
  if (input.message?.trim()) payload.message = input.message.trim().slice(0, 2000);
  if (input.productId?.trim()) payload.productId = input.productId.trim();
  if (input.productCode?.trim()) payload.productCode = input.productCode.trim();
  if (input.articleNumber?.trim()) payload.articleNumber = input.articleNumber.trim();
  if (input.productName?.trim()) payload.productName = input.productName.trim().slice(0, 200);
  if (input.sourcePage?.trim()) payload.sourcePage = input.sourcePage.trim().slice(0, 200);

  await setDoc(ref, payload);
  return requestId;
}

/**
 * Real-time onSnapshot listener for Admin incoming requests.
 * Calls callback whenever requests change.
 */
export function subscribeToRequests(
  callback: (requests: CustomerRequest[]) => void,
  onError?: (err: Error) => void,
  statusFilter?: RequestStatus | "all"
): () => void {
  const reqRef = collection(db, "requests");
  let q = query(reqRef, orderBy("createdAt", "desc"), limit(100));

  if (statusFilter && statusFilter !== "all") {
    q = query(
      reqRef,
      where("status", "==", statusFilter),
      orderBy("createdAt", "desc"),
      limit(100)
    );
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items: CustomerRequest[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          requestId: data.requestId || d.id,
          requestType: data.requestType || "product_inquiry",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone,
          company: data.company,
          message: data.message,
          productId: data.productId,
          productCode: data.productCode,
          articleNumber: data.articleNumber,
          productName: data.productName,
          sourcePage: data.sourcePage,
          locale: data.locale || "tr",
          status: data.status || "new",
          internalNotes: data.internalNotes,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      callback(items);
    },
    (error) => {
      console.error("[subscribeToRequests] Error:", error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Admin action: update status and optional internal notes of a request
 */
export async function updateRequestStatus(
  docId: string,
  status: RequestStatus,
  internalNotes?: string
): Promise<void> {
  const ref = doc(db, "requests", docId);
  const updateData: Record<string, any> = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (internalNotes !== undefined) {
    updateData.internalNotes = internalNotes;
  }
  await updateDoc(ref, updateData);
}

/**
 * Record administrative activity log
 */
export async function logAdminActivity(
  entry: Omit<AdminAuditLog, "logId" | "createdAt">
): Promise<void> {
  try {
    const ref = doc(collection(db, "admin_audit_logs"));
    const logId = "LOG-" + Date.now().toString(36).toUpperCase();
    await setDoc(ref, {
      logId,
      ...entry,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[logAdminActivity] Failed to write audit log:", err);
  }
}

/**
 * Get recent audit logs
 */
export async function getRecentAuditLogs(count = 25): Promise<AdminAuditLog[]> {
  try {
    const q = query(
      collection(db, "admin_audit_logs"),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminAuditLog));
  } catch (err) {
    console.warn("[getRecentAuditLogs] Error:", err);
    return [];
  }
}
