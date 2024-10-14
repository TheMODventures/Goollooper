"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import PendingIcon from "@/public/assets/Image/pending.png";
import CompletedIcon from "@/public/assets/Image/approved.png";
import AmountIcon from "@/public/assets/Image/dollar.png";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { createPaymentIntent, fetchPayments, goollooperBalance, stripeBalance, withdrawGoollooperBalance } from "@/store/Slices/PaymentSlice";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircleIcon } from "lucide-react";
import { Users } from "@/components/User/Users";
import Pagination from "@/components/User/Pagination/Pagination";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import { formatAmount } from "@/lib/utils";
import Search from "../Searching/Search";
import { Input } from "../ui/input";
import CheckoutPage from "./ExpressCheckout";

const PaymentsPageContent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const payments = useSelector((state: RootState) => state.payment.payments);
    const stripeBalanceData = useSelector((state: RootState) => state.payment.stripeBalance);
    const goollooperBalanceData = useSelector((state: RootState) => state.payment.goollooperBalance);
    const status = useSelector((state: RootState) => state.payment.status);
    const error = useSelector((state: RootState) => state.payment.error);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [type, setType] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [clientSecret, setClientSecret] = useState<string>("");
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const [pageData, setPageData] = useState({
        totalPages: 0,
        totalItems: 0,
        limit: 10,
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(fetchPayments({ page: currentPage, limit: pageData.limit, type: type }));
            dispatch(stripeBalance());
            dispatch(goollooperBalance());
        }, 2000);

        return () => clearInterval(intervalId);
    }, [dispatch, currentPage, pageData.limit, goollooperBalanceData, type]);



    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const withdrawGoollooper = () => {
        dispatch(withdrawGoollooperBalance(parseInt(goollooperBalanceData)));
    };

    const handleFilter = (value: string | number) => {
        if (typeof value === "string") setType(value);
    }

    const fetchPaymentIntent = async (value: number) => {
        try {
            console.log("Fetching payment intent for amount:", value);
            const response = await dispatch(createPaymentIntent(value)).unwrap();
            console.log("Payment intent response:", response.client_secret);
            setClientSecret(response.client_secret);
            setPaymentIntentId(response.id);
        } catch (error) {
            console.error("Error creating payment intent:", error);
        }
    };

    const resetAmount = () => {
        setAmount("");
    }

    return (
        <DashboardLayout Active={7}>
            <div className="mx-[0.813em] my-[0.688em] border border-border bg-white rounded-md pl-[1.75em] pt-[2rem]">

                <section className="grid grid-cols-4 items-center mb-[2em] justify-between">
                    <div className="flex flex-col items-start space-y-1">
                        <Image src={PendingIcon} alt="Users Icon" width={40} height={40} />
                        <h1 className="text-[1.625rem] leading-[2.438rem] font-bold pt-[0.313rem]">${formatAmount(stripeBalanceData?.pending)}</h1>
                        <div className="flex flex-row gap-2 items-center">
                            <p className="text-[0.875rem] leading-[1.313rem] text-subTitleColor">
                                Total Pending Amount
                            </p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertCircleIcon size={15} className="cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent className="w-80">
                                        <p>
                                            The pending amount will automatically be transferred to available balance in 4 to 5 business days.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="flex flex-col items-start space-y-1 ml-4">
                        <Image src={CompletedIcon} alt="Users Icon" width={42} height={42} />
                        <h1 className="text-[1.625rem] leading-[2.438rem] font-bold pt-[0.313rem]">${formatAmount(stripeBalanceData?.available)}</h1>
                        <p className="text-[0.875rem] leading-[1.313rem] text-subTitleColor">
                            Total Available Amount
                        </p>
                    </div>

                    <div className="flex flex-col items-start space-y-1 ml-4">
                        <Image src={AmountIcon} alt="Users Icon" width={42} height={42} />
                        <div className="flex flex-row gap-4">
                            <h1 className="text-[1.625rem] leading-[2.438rem] font-bold pt-[0.313rem]">
                                {typeof goollooperBalanceData === "number"
                                    ? `$${formatAmount(goollooperBalanceData)}`
                                    : "$0"}
                            </h1>
                            <ConfirmationModal isAccept={false} onAccept={withdrawGoollooper} amount={goollooperBalanceData} />
                        </div>
                        <p className="text-[0.875rem] leading-[1.313rem] text-subTitleColor">
                            Total Goollooper&apos;s Amount
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 w-2/3 m-auto">
                        <Input placeholder="Please enter an amount" value={amount} onChange={(e)=> {
                            setAmount(e.target.value);
                        }} />
                        <CheckoutPage amount={Number(amount) ?? 0} resetAmount={resetAmount} handleClientSecret={fetchPaymentIntent} clientSecret={clientSecret} paymentIntentId={paymentIntentId} />
                    </div>
                </section>

                <div className="pb-4">
                    <Search isSubAdmin={false} isUser={false} users={payments?.result} onRoleFilterChange={handleFilter} />
                    <Users users={payments?.result} isSubAdmin={false} isPayment={true} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={payments?.pagination?.totalPages}
                        totalItems={payments?.pagination?.totalItems}
                        onPageChange={handlePageChange}
                        limit={pageData.limit}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PaymentsPageContent;