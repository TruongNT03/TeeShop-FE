import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  forgotPasswordMutation,
  verifyForgotPasswordMutation,
} from "@/queries/authQueries";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const emailSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
});
type EmailFormData = z.infer<typeof emailSchema>;

const otpSchema = z.object({
  OTP: z
    .string()
    .length(6, "OTP phải có 6 ký tự")
    .regex(/^\d+$/, "OTP chỉ chứa số"),
});
type OtpFormData = z.infer<typeof otpSchema>;

// Component
const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [requestToken, setRequestToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  // Mutations
  const emailMutation = forgotPasswordMutation();
  const otpMutation = verifyForgotPasswordMutation();

  // Form hooks
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { OTP: "" },
  });

  // Submit handlers
  const onEmailSubmit = (data: EmailFormData) => {
    emailMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success("Đã gửi OTP vào email của bạn!");
        setRequestToken(response.data.token); // Lưu lại UUID token
        setUserEmail(data.email);
        setStep("otp");
      },
    });
  };

  const onOtpSubmit = (data: OtpFormData) => {
    if (!requestToken) {
      toast.error("Phiên làm việc đã hết hạn. Vui lòng thử lại.");
      setStep("email");
      return;
    }

    otpMutation.mutate(
      { token: requestToken, data },
      {
        onSuccess: () => {
          toast.success("Xác thực thành công!");
          setStep("success");
        },
      }
    );
  };

  // Render logic
  const renderEmailStep = () => (
    <>
      <CardHeader>
        <CardTitle className="text-center text-3xl">QUÊN MẬT KHẨU</CardTitle>
        <CardDescription className="text-center pt-2">
          Vui lòng nhập email của bạn để nhận mã OTP.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-6"
              type="submit"
              disabled={emailMutation.isPending}
            >
              {emailMutation.isPending ? <Spinner /> : "Gửi OTP"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );

  const renderOtpStep = () => (
    <>
      <CardHeader>
        <CardTitle className="text-center text-3xl">NHẬP MÃ OTP</CardTitle>
        <CardDescription className="text-center pt-2">
          Một mã OTP đã được gửi đến
          <br />
          <span className="font-medium text-foreground">{userEmail}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
            <FormField
              control={otpForm.control}
              name="OTP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-6"
              type="submit"
              disabled={otpMutation.isPending}
            >
              {otpMutation.isPending ? <Spinner /> : "Xác nhận"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <CardHeader>
        <CardTitle className="text-center text-3xl">THÀNH CÔNG!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <CardDescription className="text-center">
          Một mật khẩu mới đã được gửi đến email
          <br />
          <span className="font-medium text-foreground">{userEmail}</span>.
          <br />
          Vui lòng kiểm tra và đăng nhập lại.
        </CardDescription>
      </CardContent>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden flex">
      <Toaster richColors />
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 100 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
        className="w-full flex-1 min-h-screen relative z-10 flex flex-col justify-center items-center"
      >
        <Card className="w-96 border-0 shadow-none">
          {step === "email" && renderEmailStep()}
          {step === "otp" && renderOtpStep()}
          {step === "success" && renderSuccessStep()}

          <CardFooter className="justify-center">
            <Link to="/login">
              <div className="hover:underline">Quay lại Đăng nhập</div>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
      <motion.div
        className="flex-1 bg-primary z-20 flex justify-center items-center"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
      >
        <img src="login-icon.png" alt="" className="max-w-[350px]" />
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
