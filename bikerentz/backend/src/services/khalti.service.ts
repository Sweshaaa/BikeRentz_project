import axios from "axios";

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || "https://a.khalti.com/api/v2";
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

interface InitiatePaymentParams {
  amount: number; // in NPR (rupees) - will be converted to paisa
  purchaseOrderId: string;
  purchaseOrderName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl: string;
  websiteUrl: string;
}

interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: "Completed" | "Pending" | "Expired" | "User canceled" | "Refunded";
  transaction_id: string | null;
  fee: number;
  refunded: boolean;
}

export class KhaltiService {
  private headers() {
    return {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
  }

  async initiate(params: InitiatePaymentParams): Promise<KhaltiInitiateResponse> {
    const payload = {
      return_url: params.returnUrl,
      website_url: params.websiteUrl,
      amount: Math.round(params.amount * 100), // convert NPR to paisa
      purchase_order_id: params.purchaseOrderId,
      purchase_order_name: params.purchaseOrderName,
      customer_info: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || "9800000000",
      },
    };

    const { data } = await axios.post<KhaltiInitiateResponse>(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      payload,
      { headers: this.headers() }
    );

    return data;
  }

  async verify(pidx: string): Promise<KhaltiLookupResponse> {
    const { data } = await axios.post<KhaltiLookupResponse>(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      { headers: this.headers() }
    );

    return data;
  }
}
