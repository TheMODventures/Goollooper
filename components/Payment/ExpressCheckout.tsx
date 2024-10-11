"use client";
import React, {  useState } from "react";
import {
  useStripe,
  useElements,
  Elements,
  PaymentRequestButtonElement,
  CardElement,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { loadStripe, PaymentRequest } from "@stripe/stripe-js";
import { Api } from "@/api/Middleware";
import { DialogClose } from "@radix-ui/react-dialog";
import { CircleCheck } from "lucide-react";

const stripeKey = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


const CheckoutForm = ({
  amount,
  clientSecret,
  paymentIntentId,
  handleSuccess,
}: {
  amount: number;
  clientSecret: string;
  paymentIntentId: string;
  handleSuccess: (value: boolean) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      pr.on("paymentmethod", async (event) => {
        const { error: confirmError } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: event.paymentMethod.id,
          }
        );

        if (confirmError) {
          event.complete("fail");
          setErrorMessage(confirmError.message);
        } else {
          event.complete("success");
          console.log("Payment successful!");
        }
      });
    }
  }, [stripe, amount, clientSecret]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      setLoading(false);
      return;
    }
    const { error } = await elements.submit();
    if (error) {
      alert("ERROR")
    } 
    const payment = elements.getElement(CardElement);

    if(!payment){
      return;
    }


    const { error } = await elements.submit();
    if (error) {
      alert("ERROR");
      setLoading(false);
      return;
    }

    const payment = elements.getElement(CardElement);

    if (!payment) {
      return;
    }

    const { error: submitError, paymentMethod } =
      await stripe.createPaymentMethod({
        card: payment,
        type: "card",
      });


    if (submitError) {
      console.error("Error creating payment method:", submitError);
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    try {
      const response = await Api.post("/stripe/confirm-payment", {
        paymentIntentId: paymentIntentId,
        paymentMethod: paymentMethod.id,
      });

      const result = await response;
      console.log("RESULTS", result);
      if (result.statusText === "OK") {
        handleSuccess(true);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>

      {paymentRequest && (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}
      <CardElement />

      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full mt-8 text-white rounded-full py-2 bg-PrimaryColor"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

const CheckoutPage = ({
  amount,
  clientSecret,
  paymentIntentId,
  handleClientSecret,
}: {
  amount: number;
  clientSecret: string;
  paymentIntentId: string;
  handleClientSecret: (value: number) => void;
}) => {

  const [success, setSucess] = useState<boolean>(false);

  const handleSucess = (value: boolean) => {
    setSucess(value);
  };

  const options = {
    clientSecret: clientSecret,
    appearance: {
      theme: "stripe",
    },
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-white rounded-full py-2 bg-PrimaryColor"
          onClick={() => handleClientSecret(amount)}
        >
          Top Up ${amount}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Top Up</DialogTitle>

        <DialogDescription>
          {!success ? (
            "Complete your payment below."
          ) : (
            <div className="text-center">
              <CircleCheck className="w-10 h-10 text-green-500 mx-auto" />
              <h1 className="mt-2">Payment Successful</h1>
            </div>
          )}
        </DialogDescription>
        {clientSecret && !success ? (
          <Elements stripe={stripeKey} options={options as any}>
            <CheckoutForm
              amount={amount}
              clientSecret={clientSecret}
              paymentIntentId={paymentIntentId}
              handleSuccess={handleSucess}
            />

          </Elements>
        ) : (
          <DialogClose>
            <button className="w-full text-white rounded-full py-2 bg-PrimaryColor">
              Close
            </button>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutPage;
    // try {
    //   const response = await fetch('/stripe/confirm-payment', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       paymentIntentId: paymentIntentId,
    //       paymentMethod: paymentMethod.id,
    //     }),
    //   });

    //   const result = await response.json();
    // console.log("RESULTS",result)
    // } catch (error) {
    //   console.error("Error confirming payment:", error);
    //   setErrorMessage("An unexpected error occurred. Please try again.");
    // }