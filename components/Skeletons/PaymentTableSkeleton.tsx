import React from 'react';
import { Skeleton } from '../ui/skeleton';

const PaymentTableSkeleton: React.FC = () => {

    return (
        <div className="mr-6 flex flex-col gap-2 mb-6">
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
        </div>
    );
};

export default PaymentTableSkeleton;