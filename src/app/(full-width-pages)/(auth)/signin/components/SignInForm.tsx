"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type SignInFormValues = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
    // Handle form submission logic, e.g., API call
    console.log(data);
  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center  flex-1 w-full max-w-md mx-auto ">
        <div className="rounded-sm px-12 py-10 w-full border border-stroke bg-white/80 dark:bg-black/60 backdrop-blur-sm shadow-2xl dark:border-strokedark">
          <div className=" mb-2 text-center sm:mb-0">
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={48}
                height={48}
              />
            </Link>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
       
          </div>
          <div>
         
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    {...register('email', {
                      required: 'Email is required.',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email address.',
                      },
                    })}
                      error={!!errors.email}
                      hint={errors.email?.message}
                  />
               
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required.',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters long.',
                        },
                      })}
                      error={!!errors.password}
                      hint={errors.password?.message}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
              
                </div>
                <div>
                  <Button className="w-full" size="sm" >
                    Sign in
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
         
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
