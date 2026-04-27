"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";
import { useCurrency } from "../../components/CurrencyContext";
import { useRouter } from "next/navigation";

type Props = {
  orderId: number;
  onError: (msg: string) => void;
};

export default function PayPalButton({ orderId, onError }: Props) {
  const { token, loading: authLoading } = useAuth();
  const { clearCart } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();

  // Don't render PayPal buttons until the auth token is restored from localStorage
  if (authLoading || !token) return null;

  async function createPayPalOrder() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_id: orderId }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.message ?? data?.error ?? `Server error ${res.status}`;
      onError(`PayPal setup failed: ${msg}`);
      throw new Error(msg);
    }
    const data = await res.json();
    if (!data.paypal_order_id) {
      onError("PayPal setup failed: no order ID returned.");
      throw new Error("No paypal_order_id in response");
    }
    return data.paypal_order_id;
  }

  async function onApprove(data: { orderID: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/capture-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paypal_order_id: data.orderID }),
    });
    if (!res.ok) {
      onError("Payment capture failed. Please try again.");
      return;
    }
    clearCart();
    router.push("/checkout/success");
  }

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "", currency: currency.code }}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", label: "pay" }}
        createOrder={createPayPalOrder}
        onApprove={onApprove}
        onError={(err) => { console.error("PayPal SDK error:", err); onError("Something went wrong with PayPal. Please try again."); }}
        onCancel={() => router.push("/checkout/cancel")}
      />
    </PayPalScriptProvider>
  );
}
