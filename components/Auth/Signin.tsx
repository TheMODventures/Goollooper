"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(false);
  const userRole = useSelector((state: RootState) => state.user.user?.role);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    trigger,
  } = useForm<SigninFields>({ 
    resolver: zodResolver(SignInSchema), 
    mode: "onChange",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setValue("email", savedEmail);
      setValue("password", savedPassword);
      setRememberMe(true);
      
      // Trigger validation after setting values
      trigger(["email", "password"]);
    }
  }, [setValue, trigger]);

  const handleCheckboxChange = (checked: boolean) => {
    setRememberMe(checked);
  };

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

    if (rememberMe) {
      localStorage.setItem('email', data.email);
      localStorage.setItem('password', data.password);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  };

  if (userRole === 1 || userRole === 4) { 
    router.push("/dashboard"); 
  }
  if (userRole === 5) {
    router.push("/dashboard");
  };

  console.log("Form State:", { isValid, isDirty, emailValue, passwordValue, errors });
  const isFormValid = isValid && emailValue && passwordValue;

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
                errors.email ? 'border-red-500' : ''
              }`}
            />
            <div className="absolute">
              {errors.email?.message && (
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
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <div className="absolute">
              {errors.password?.message && (
                <Tooltip message={errors.password?.message as string} />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-[0.875em] mb-[1.813em]">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="login-checkbox"
              className="w-[1.063em] h-[1.063em] rounded-md border-border data-[state=checked]:bg-PrimaryColor"
              checked={rememberMe}
              onCheckedChange={handleCheckboxChange}
            />
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
          disabled={!isFormValid}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </>
  );
}

export default Signin;