"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/store/reducers/rootReducer";
import { fetchUserData } from "@/store/Slices/PaymentSlice";
import { useSelector } from "react-redux";

interface DashboardDataProps {
  currentPage: number;
  onDataLoaded: (data: { users: any; userCount: number; taskCount: number; pageData: any }) => void;
}

const DashboardData: React.FC<DashboardDataProps> = ({ currentPage, onDataLoaded }) => {
  const dispatch = useAppDispatch();
  const { users, userCount, taskCount, pageData } = useSelector((state: RootState) => state.payment);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUserData({ page: currentPage, limit: pageData?.limit ?? 10 })); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
        onDataLoaded({ users, userCount, taskCount, pageData });
      }
    };

    fetchData();
  }, [dispatch, currentPage, pageData?.limit, onDataLoaded, pageData, taskCount, userCount, users]);

  return isLoading ? <div>Loading dashboard data...</div> : null; 
};

export default DashboardData;