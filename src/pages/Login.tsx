import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "motion/react";
import { Home } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const {
    form,
    isRememberMe,
    onSubmit,
    setIsRememberMe,
    isShowPassword,
    setIsShowPassword,
    isLoading,
  } = useLogin();
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for messages from popup
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        const { accessToken, refreshToken } = event.data;
        saveToken(accessToken, refreshToken);
        navigate("/");
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        toast.error(event.data.message || "Đăng nhập thất bại!");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [saveToken, navigate]);

  const handleGoogleLogin = () => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `${backendUrl}/api/v1/auth/google`,
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden flex">
      <motion.div
        className="flex-1 bg-primary z-20 flex justify-center items-center"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
      >
        <img src="login-icon.png" alt="" className="max-w-[350px]" />
      </motion.div>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 100 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
        className="w-full min-h-screen bg-background relative z-10 flex-1 flex flex-col justify-center items-center"
      >
        <Card className="w-96 border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-3xl">ĐĂNG NHẬP</CardTitle>
            <div className="text-center mt-5">
              Chào mừng bạn trở lại!
              <br /> Nhập thông tin tài khoản để đăng nhập.
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <FormField
                  control={form.control}
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mt-5">
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Mật khẩu"
                            type={isShowPassword ? "text" : "password"}
                            {...field}
                          />
                          <div
                            className="absolute right-4 top-[30%] cursor-pointer"
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

                <div className="flex gap-2 items-center justify-between mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      onChange={() => setIsRememberMe((prev) => !prev)}
                    />
                    <div>Ghi nhớ đăng nhập</div>
                  </div>
                  <Link to="/forgot-password">
                    <div className="underline">Quên mật khẩu?</div>
                  </Link>
                </div>
                <Button
                  className="w-full mt-4"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : "Đăng nhập"}
                </Button>
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full mt-4 bg-red-400 hover:bg-red-500"
                >
                  <FaGoogle className="mr-2" />
                  Đăng nhập với Google
                </Button>
                <Link to="/">
                  <Button variant="outline" className="w-full mt-4">
                    Quay về trang chủ
                  </Button>
                </Link>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-center">
              Chưa có tài khoản? Nhấn{" "}
              <Link to="/register" className="underline text-primary">
                vào đây
              </Link>{" "}
              để đăng ký.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
