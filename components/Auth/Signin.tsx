"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Tooltip from "@/components/Tooltip/ToolTip";

import { SiginFields, SigninFields } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/validation/AuthValidation/auth";
import { setUser } from "@/store/actions/userAction";
import { onLogin } from "@/api";
import { useAppDispatch } from "@/lib/hooks";
import { Checkbox } from "../ui/checkbox";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

function Signin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SigninFields>({ resolver: zodResolver(SignInSchema), mode: "onChange" });
  const [loading, setLoading] = useState<boolean>(false);

  const userRole = useSelector((state: RootState) => state.user.user?.role);

  const onSubmit: SubmitHandler<SigninFields> = async (data: SiginFields) => {
    try {
      setLoading(true);
      let loginRes: any = await onLogin(data);
      console.log(loginRes);
      if (loginRes?.data?.code === 200) {
        dispatch(setUser(loginRes?.data));
        setLoading(false);
        toast.success(loginRes?.data?.msg);
      } else {
        toast.warning(loginRes?.msg);
      }
    } catch (error: Error | any) {
      setLoading(false);
      toast.error(error?.response?.data?.data);
    }
  };
  if (userRole === 1 || userRole === 4) { 
    router.push("/dashboard"); 
  }
  if (userRole === 5) {
    router.push("/dashboard");
  };

  const emailValue = watch("email");
  const passwordValue = watch("password");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <p className="absolute text-[0.875rem] leading-[1.098rem] text-PrimaryColor pt-[0.688em] pl-[1.313em]">
            Email Address*
          </p>
          <div className="flex">
            <Input
              {...register("email")}
              type="email"
              placeholder="@mail.com"
              className={`rounded-lg bg-backGroundColor text-[0.875rem] leading-[1.313rem] pt-[2.188em] pl-[1.313em] text-black h-[4.125em] focus-visible:outline-none focus-visible:ring-0 ${
                errors.email && emailValue ? 'border-red-500' : ''
              }`}
            />
            <div className="absolute ">
              {errors.email?.message && emailValue && (
                <Tooltip message={errors.email?.message as string} />
              )}
            </div>
          </div>
        </div>
        <div className="relative mt-[0.75em]">
          <p className="absolute text-[0.875rem] leading-[1.098rem] text-PrimaryColor pt-[0.688em] pl-[1.313em]">
            Password*
          </p>
          <div className="flex">
            <Input
              {...register("password")}
              type="password"
              placeholder="********"
              className={`rounded-lg bg-backGroundColor text-[0.875rem] leading-[1.313rem] pt-[2.188em] pl-[1.313em] text-black h-[4.125em] focus-visible:outline-none focus-visible:ring-0 ${
                errors.password && passwordValue ? 'border-red-500' : ''
              }`}
            />
            <div className="absolute">
              {errors.password?.message && passwordValue && (
                <Tooltip message={errors.password?.message as string} />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-[0.875em] mb-[1.813em]">
          <div className="flex items-center space-x-2">
            <Checkbox id="login-checkbox" className="w-[1.063em] h-[1.063em] rounded-md border-border data-[state=checked]:bg-PrimaryColor" />
            <label htmlFor="login-checkbox" className="text-[0.875rem] leading-[1.313rem]">
              Remember me
            </label>
          </div>

          <div>
            <Link className="text-red-600 text-[0.875rem] leading-[1.313rem] font-normal " href={"/forget"}>
              Forgot Password?
            </Link>
          </div>
        </div>
        <Button
          className={`w-full h-[4.125rem] text-[1.125rem] mb-[1.875rem] rounded-full bg-SecondaryColor`}
          type="submit"
          disabled={!(emailValue && passwordValue && !errors.email && !errors.password)}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </>
  );
}

export default Signin;
