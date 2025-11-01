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
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  registerMutation,
  verifyRegisterMutation,
} from "@/queries/authQueries";
import { CheckCircle2 } from "lucide-react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { motion } from "motion/react";

const registerSchema = z
  .object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Gắn lỗi vào trường confirmPassword
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const otpSchema = z.object({
  OTP: z
    .string()
    .length(6, "OTP phải có 6 ký tự")
    .regex(/^\d+$/, "OTP chỉ chứa số"),
});
type OtpFormData = z.infer<typeof otpSchema>;

const Register = () => {
  const [step, setStep] = useState<"register" | "otp" | "success">("register");
  const [requestToken, setRequestToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const regMutation = registerMutation();
  const verifyMutation = verifyRegisterMutation();

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { OTP: "" },
  });

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { email, password } = data;
    regMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          toast.success("Đã gửi OTP vào email của bạn!");
          setRequestToken(response.data.token);
          setUserEmail(data.email);
          setStep("otp");
        },
      }
    );
  };

  const onOtpSubmit = (data: OtpFormData) => {
    if (!requestToken) {
      toast.error("Phiên làm việc đã hết hạn. Vui lòng thử lại.");
      setStep("register");
      return;
    }

    verifyMutation.mutate(
      { token: requestToken, data },
      {
        onSuccess: () => {
          toast.success("Xác thực thành công!");
          setStep("success");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        },
      }
    );
  };

  const renderRegisterStep = () => (
    <>
      <CardHeader>
        <CardTitle className="text-center text-3xl">REGISTER</CardTitle>
        <div className="text-center pt-2">Create your account</div>
      </CardHeader>
      <CardContent>
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            {/* Email */}
            <FormField
              control={registerForm.control}
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
            {/* Password */}
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={isShowPassword ? "text" : "password"}
                        {...field}
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsShowPassword((prev) => !prev)}
                      >
                        {isShowPassword ? (
                          <IoEyeOutline />
                        ) : (
                          <IoEyeOffOutline />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm Password */}
            <FormField
              control={registerForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={isShowConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          setIsShowConfirmPassword((prev) => !prev)
                        }
                      >
                        {isShowConfirmPassword ? (
                          <IoEyeOutline />
                        ) : (
                          <IoEyeOffOutline />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-6"
              type="submit"
              disabled={regMutation.isPending}
            >
              {regMutation.isPending ? <Spinner /> : "Submit"}
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
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? <Spinner /> : "Xác nhận"}
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
          Đăng ký tài khoản thành công!
          <br />
          Đang chuyển hướng bạn đến trang đăng nhập...
        </CardDescription>
      </CardContent>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-primary relative overflow-hidden flex">
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 100 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
        className="flex-1 w-full bg-white min-h-screen relative z-10 flex flex-col justify-center items-center"
      >
        <Card className="w-96 border-0 shadow-none">
          {step === "register" && renderRegisterStep()}
          {step === "otp" && renderOtpStep()}
          {step === "success" && renderSuccessStep()}

          <CardFooter className="justify-center">
            <Link to="/login">
              <div className="text-center">
                Don't have an account? Click{" "}
                <span className="underline cursor-pointer text-blue-500">
                  here
                </span>{" "}
                to login.
              </div>
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

export default Register;
