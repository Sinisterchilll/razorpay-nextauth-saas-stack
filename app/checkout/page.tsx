"use client";
import * as React from "react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { LoaderCircle } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const amount = params.get("amount");
  const [loading1, setLoading1] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const createOrderId = React.useCallback(async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount!) * 100,
          plan: params.get("plan"),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOrderId(data.orderId);
      setLoading1(false);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      setLoading1(false);
    }
  }, [amount, params]);

  React.useEffect(() => {
    if (!amount) {
      router.replace("/");
    }
    createOrderId();
  }, [amount, router, createOrderId]);

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Create a new order ID for each payment attempt
    await createOrderId();

    if (!orderId) {
      alert("Failed to create order. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const options = {
        key: process.env.key_id,
        amount: parseFloat(amount!) * 100,
        currency: "INR",
        name: "Your Business Name",
        description: `Subscription - ${params.get("plan")} Plan`,
        order_id: orderId,
        handler: async function (response: any) {
          const verifyData = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            plan: params.get("plan"),
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(verifyData),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.success) {
            alert("Payment successful! Your subscription has been updated.");
            router.push("/dashboard"); // Redirect to dashboard or confirmation page
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: { color: "#3399cc" },
        // Add UPI payment method
        method: {
          upi: true,
          netbanking: true,
          card: true,
        },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed. " + response.error.description);
      });
      setLoading(false);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading1) return <div className="container h-screen flex justify-center items-center">
    <LoaderCircle className=" animate-spin h-20 w-20 text-primary" />
    </div>
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <section className="container h-screen flex flex-col justify-center items-center gap-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          Checkout
        </h1>
        <Card className="max-w-[25rem] space-y-8">
          <CardHeader>
            <CardTitle className="my-4">Choose Payment Method</CardTitle>
            <CardDescription>
              Select your preferred payment method to complete the subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={processPayment}>
              <Button className="w-full mb-4" type="submit">
                {loading ? "...loading" : "Pay with Card/UPI"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex">
            <p className="text-sm text-muted-foreground underline underline-offset-4">
              Please read the terms and conditions.
            </p>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="container h-screen flex justify-center items-center">
      <LoaderCircle className="animate-spin h-20 w-20 text-primary" />
    </div>
  );
}