"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import GuidelineLayout from "../layouts/GuidelineLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Editor from "@/components/Editor/Editor";
import { Button } from "@/components/ui/button";

import { addGuidline, getGuidline, updateGuidline } from "@/api";
import QuillToolbar from "@/components/Editor/Toolbar";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/components/WithAuth/withAuth";
import { set } from "date-fns";

const TermsPage = () => {
  const isAuthenticated = useAuth('/');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [termsAndCondition, setTermsAndCondition] = useState<string>("");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let termsRes = await getGuidline(2);
      if (termsRes?.data?.data?.length) {
        setTermsAndCondition(termsRes?.data?.data[0]?.content);
        setId(termsRes?.data?.data[0]?._id);
      }
      setLoading(false);
    } catch (error: Error | any) {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!termsAndCondition) {
      toast.warning("Please type terms and condition");
      return;
    }
    try {
      setLoading(true);
      const cleanedTermsAndCondition = termsAndCondition.replaceAll("<p><br></p>", "<br>");
      // setTermsAndCondition(cleanedTermsAndCondition);  
      console.log("cleanedTermsAndCondition", cleanedTermsAndCondition);
      let data = {
        type: 2,
        content: cleanedTermsAndCondition,
      };
      let termsRes: any;
      if (id) {
        termsRes = await updateGuidline(id, data);
      } else {
        termsRes = await addGuidline(data);
      }

      if (termsRes?.data?.status) {
        toast.success(termsRes?.data?.msg);
        setLoading(false);
      } else {
        toast.warning(termsRes?.data?.msg);
      }
    } catch (error: Error | any) {
      setLoading(false);
      if (typeof error?.response?.data?.data === "object") {
        error?.response?.data?.data?.map((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error(error?.response?.data?.msg);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={[1, 4]}>
    <DashboardLayout Active={5}>
      <GuidelineLayout>
        <div className="h-calc-screen bg-white rounded-md mr-2 pt-[0.5em] pb-4 border border-border">
          <div className="w-[49.6vw]">
            <QuillToolbar />

            <Editor value={termsAndCondition} onChange={setTermsAndCondition} />
          </div>
          <div className="flex flex-row justify-between pt-4">
            <div></div>
            <Button
              className="rounded-full bg-PrimaryColor mr-[2.375em]"
              onClick={onSubmit}
            >
              {id ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </GuidelineLayout>
    </DashboardLayout>
    </RoleGuard>
  );
}

export default TermsPage;
