import SignInForm from "@/app/(full-width-pages)/(auth)/signin/components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn",
  description: "This is Signin Page For GiveCredit ",
};

export default function SignIn() {
  return <SignInForm />;
}
