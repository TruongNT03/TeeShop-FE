import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, Copy, Loader2, Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Định nghĩa Schema cho form demo
const demoFormSchema = z.object({
  username: z.string().min(2, "Tên người dùng phải có ít nhất 2 ký tự."),
  email: z.string().email("Địa chỉ email không hợp lệ."),
  acceptTerms: z.optional(
    z
      .boolean()
      .default(false)
      .refine((val) => val === true, {
        message: "Bạn phải chấp nhận các điều khoản dịch vụ.",
      })
  ),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

const DemoPage = () => {
  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      username: "demo_user",
      email: "test@example.com",
      acceptTerms: false,
    },
  });

  const onSubmit = (data: DemoFormValues) => {
    console.log("Dữ liệu Form đã gửi:", data);
    alert(`Form đã gửi thành công!\nDữ liệu: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="w-full py-10 px-6 sm:px-10 lg:px-16 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-8 text-foreground">
        Demo Tất cả Component UI
      </h1>
      <Separator className="mb-8" />

      {/* 1. Card & Badge */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          1. Card & Badge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-0">
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <CardTitle>Thẻ Thông tin</CardTitle>
                <Badge variant="default" className="gap-1">
                  <Check className="size-3" />
                  Mới
                </Badge>
              </div>
              <CardDescription>
                Đây là giao diện của một Card tiêu chuẩn.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p>Card là container cơ bản để nhóm nội dung liên quan.</p>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardHeader className="p-6">
              <CardTitle>Các Loại Badge</CardTitle>
              <CardDescription>
                Xem các biến thể màu sắc khác nhau.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex flex-wrap gap-2">
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Lỗi</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="default">Mặc định</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* 2. Buttons */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">2. Buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Mặc định</Button>
          <Button variant="secondary">Phụ</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Xóa</Button>
          <Button variant="link">Liên kết</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Nhỏ</Button>
          <Button size="lg">Lớn</Button>
          <Button size="icon">
            <Mail />
          </Button>
          <Button>
            <Loader2 className="animate-spin" />
            Đang tải
          </Button>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* 3. Form, Input, Textarea, Checkbox */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          3. Form, Input & Controls
        </h2>
        <Card className="p-0 max-w-lg">
          <CardHeader className="p-6">
            <CardTitle>Demo Form Validation</CardTitle>
            <CardDescription>
              Sử dụng `react-hook-form` và `zod`.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Input Field: Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên người dùng</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Đây là mô tả hữu ích cho trường nhập liệu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Input Field: Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@shop.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Textarea Field (Không dùng form field để demo component) */}
                <FormItem>
                  <FormLabel>Ghi chú (Textarea)</FormLabel>
                  <Textarea placeholder="Viết ghi chú của bạn ở đây..." />
                </FormItem>

                {/* Checkbox Field */}
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Tôi chấp nhận các điều khoản dịch vụ
                        </FormLabel>
                        <FormDescription>
                          Vui lòng đọc kỹ các điều khoản trước khi tiếp tục.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Gửi Form
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-10" />

      {/* 4. Popover & Tooltip */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          4. Popover & Tooltip
        </h2>
        <div className="flex gap-10">
          {/* Popover Demo */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Mở Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Thông báo</h4>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật cài đặt tài khoản của bạn.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div className="col-span-1 text-sm">Trạng thái</div>
                    <div className="col-span-2">Đang hoạt động</div>
                  </div>
                  <Button size="sm" className="mt-2">
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Tooltip Demo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sao chép vào Clipboard</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Navigation Footer */}
      <div className="mt-10">
        <Button variant="ghost" className="text-blue-600">
          <ArrowLeft className="size-4 mr-2" />
          Quay lại Trang chủ
        </Button>
      </div>
    </div>
  );
};

export default DemoPage;
