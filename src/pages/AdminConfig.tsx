import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import CustomUpload from "@/components/CustomUpload";
import { useState } from "react";
import {
  Image,
  Save,
  Loader2,
  Monitor,
  Percent,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BannerConfig {
  autoPlay: boolean;
  duration: number;
  speed: number;
  imageUrls: string[];
}

interface PortalConfig {
  banner: BannerConfig;
  homepage: {
    featuredCategories: string[];
    showNewArrivals: boolean;
    newArrivalsLimit: number;
    showBestSellers: boolean;
    bestSellersLimit: number;
  };
  promotion: {
    enabled: boolean;
    bannerText: string;
    discountPercentage: number;
  };
}

// Initial config
const initialConfig: PortalConfig = {
  banner: {
    autoPlay: true,
    duration: 3000,
    speed: 500,
    imageUrls: [],
  },
  homepage: {
    featuredCategories: [],
    showNewArrivals: true,
    newArrivalsLimit: 8,
    showBestSellers: true,
    bestSellersLimit: 8,
  },
  promotion: {
    enabled: false,
    bannerText: "🎉 Giảm giá đến 50% cho tất cả sản phẩm!",
    discountPercentage: 0,
  },
};

type StepType = "banner" | "homepage" | "promotion";

const steps = [
  {
    id: "banner" as StepType,
    title: "Banner",
    icon: Image,
    description: "Cấu hình banner carousel",
  },
  {
    id: "homepage" as StepType,
    title: "Trang chủ",
    icon: Monitor,
    description: "Cấu hình hiển thị trang chủ",
  },
  {
    id: "promotion" as StepType,
    title: "Khuyến mãi",
    icon: Percent,
    description: "Cấu hình banner khuyến mãi",
  },
];

const AdminConfig = () => {
  const [config, setConfig] = useState<PortalConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [activeStep, setActiveStep] = useState<StepType>("banner");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to save config
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Đã lưu cấu hình thành công!");
    } catch (error) {
      toast.error("Lưu cấu hình thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBannerImageChange = (urls: string[]) => {
    setConfig((prev) => ({
      ...prev,
      banner: { ...prev.banner, imageUrls: urls },
    }));
  };

  const handleStepClick = (stepId: StepType) => {
    setActiveStep(stepId);
    // Scroll to the corresponding card
    const element = document.getElementById(stepId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cấu hình Website</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý cấu hình hiển thị cho trang người dùng
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu cấu hình
            </>
          )}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar - Steps */}
        <div className="w-72 flex-shrink-0 sticky top-8 self-start">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-0">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = activeStep === step.id;
                  const isCompleted =
                    steps.findIndex((s) => s.id === activeStep) > index;

                  return (
                    <div key={step.id}>
                      <button
                        onClick={() => handleStepClick(step.id)}
                        className="w-full flex items-start gap-4 text-left group"
                      >
                        {/* Circle with icon */}
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                                : isCompleted
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-2">
                          <p
                            className={cn(
                              "font-semibold text-sm mb-1",
                              isActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            )}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </button>

                      {/* Connector line */}
                      {index < steps.length - 1 && (
                        <div className="flex items-center ml-6 my-3">
                          <div
                            className={cn(
                              "w-0.5 h-8 transition-colors",
                              isCompleted || isActive
                                ? "bg-primary"
                                : "bg-muted"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Config Cards */}
        <div className="flex-1 space-y-6">
          {/* Banner Config */}
          <Card id="banner">
            <CardHeader>
              <CardTitle>Cấu hình Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự động chuyển</Label>
                    <p className="text-sm text-muted-foreground">
                      Banner tự động chuyển slide
                    </p>
                  </div>
                  <Switch
                    checked={config.banner.autoPlay}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        banner: { ...prev.banner, autoPlay: checked },
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Thời gian hiển thị (ms)</Label>
                    <Input
                      type="number"
                      value={config.banner.duration}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            duration: Number(e.target.value) || 3000,
                          },
                        }))
                      }
                      min={1000}
                      max={10000}
                      step={500}
                    />
                    <p className="text-sm text-muted-foreground">
                      Thời gian mỗi slide được hiển thị (1000-10000ms)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Tốc độ chuyển (ms)</Label>
                    <Input
                      type="number"
                      value={config.banner.speed}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            speed: Number(e.target.value) || 500,
                          },
                        }))
                      }
                      min={100}
                      max={2000}
                      step={100}
                    />
                    <p className="text-sm text-muted-foreground">
                      Tốc độ hiệu ứng chuyển slide (100-2000ms)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Hình ảnh Banner</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tải lên tối đa 5 hình ảnh cho banner carousel
                  </p>
                  <CustomUpload
                    value={config.banner.imageUrls}
                    onChange={handleBannerImageChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Homepage Config */}
          <Card id="homepage">
            <CardHeader>
              <CardTitle>Cấu hình Trang chủ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hiển thị sản phẩm mới</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị section sản phẩm mới nhất
                    </p>
                  </div>
                  <Switch
                    checked={config.homepage.showNewArrivals}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        homepage: {
                          ...prev.homepage,
                          showNewArrivals: checked,
                        },
                      }))
                    }
                  />
                </div>

                {config.homepage.showNewArrivals && (
                  <div className="space-y-2 ml-4">
                    <Label>Số lượng sản phẩm mới</Label>
                    <Input
                      type="number"
                      value={config.homepage.newArrivalsLimit}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          homepage: {
                            ...prev.homepage,
                            newArrivalsLimit: Number(e.target.value) || 8,
                          },
                        }))
                      }
                      min={4}
                      max={20}
                      step={4}
                    />
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hiển thị sản phẩm bán chạy</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị section sản phẩm bán chạy nhất
                    </p>
                  </div>
                  <Switch
                    checked={config.homepage.showBestSellers}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        homepage: {
                          ...prev.homepage,
                          showBestSellers: checked,
                        },
                      }))
                    }
                  />
                </div>

                {config.homepage.showBestSellers && (
                  <div className="space-y-2 ml-4">
                    <Label>Số lượng sản phẩm bán chạy</Label>
                    <Input
                      type="number"
                      value={config.homepage.bestSellersLimit}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          homepage: {
                            ...prev.homepage,
                            bestSellersLimit: Number(e.target.value) || 8,
                          },
                        }))
                      }
                      min={4}
                      max={20}
                      step={4}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Promotion Config */}
          <Card id="promotion">
            <CardHeader>
              <CardTitle>Cấu hình Khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kích hoạt banner khuyến mãi</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị banner thông báo khuyến mãi trên header
                    </p>
                  </div>
                  <Switch
                    checked={config.promotion.enabled}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        promotion: { ...prev.promotion, enabled: checked },
                      }))
                    }
                  />
                </div>

                {config.promotion.enabled && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label>Nội dung banner</Label>
                      <Input
                        value={config.promotion.bannerText}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            promotion: {
                              ...prev.promotion,
                              bannerText: e.target.value,
                            },
                          }))
                        }
                        placeholder="🎉 Nhập nội dung khuyến mãi..."
                      />
                      <p className="text-sm text-muted-foreground">
                        Nội dung hiển thị trên banner khuyến mãi
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Phần trăm giảm giá (%)</Label>
                      <Input
                        type="number"
                        value={config.promotion.discountPercentage}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            promotion: {
                              ...prev.promotion,
                              discountPercentage: Number(e.target.value) || 0,
                            },
                          }))
                        }
                        min={0}
                        max={100}
                        step={5}
                      />
                      <p className="text-sm text-muted-foreground">
                        Chỉ để hiển thị, không áp dụng tự động vào giá
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="mt-4 p-3 bg-primary text-primary-foreground text-center rounded-md">
                      <p className="font-medium">
                        {config.promotion.bannerText}
                      </p>
                      {config.promotion.discountPercentage > 0 && (
                        <p className="text-sm mt-1">
                          Giảm {config.promotion.discountPercentage}% cho tất cả
                          sản phẩm
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;
