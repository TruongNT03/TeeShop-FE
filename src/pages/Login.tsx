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

const Login = () => {
  const {
    form,
    isRememberMe,
    onSubmit,
    setIsRememberMe,
    isShowPassword,
    setIsShowPassword,
    isLoading,
    setIsLoading,
  } = useLogin();
  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Soft Blue Radial Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
       radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)
     `,
        }}
      />
      {/* Your Content Here */}
      <div className="w-full min-h-screen relative z-10 flex flex-col justify-center items-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-3xl">LOGIN</CardTitle>
            <div className="text-center mt-5">
              Welcome back!
              <br /> Input your account to login.
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="password"
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
                    <div>Remember me</div>
                  </div>
                  <Link to="/forgot-password">
                    <div className="underline">Forgot password?</div>
                  </Link>
                </div>
                <Button
                  className="w-full mt-4"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : "Submit"}
                </Button>
                <Button className="w-full mt-4 bg-red-400 hover:bg-red-500">
                  <FaGoogle />
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-center mt-4">
              Don't have an account? Click{" "}
              <Link to="/register" className="underline text-blue-400">
                here
              </Link>{" "}
              to register.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
