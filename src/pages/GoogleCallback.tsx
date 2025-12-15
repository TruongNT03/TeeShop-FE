import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export enum ErrorCode {
  EMAIL_ALREADY_EXIST = "email_already_use",
}

export const ErrorCodeMap: Record<ErrorCode, string> = {
  [ErrorCode.EMAIL_ALREADY_EXIST]:
    "Email đã được sử dụng, vui lòng đăng nhập với email khác.",
};

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleGoogleCallback = () => {
      // Parse tokens from URL - check both query params and hash
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      // If no query params, check hash
      let finalAccessToken = accessToken;
      let finalRefreshToken = refreshToken;
      let finalError = error;

      if (!accessToken && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        finalAccessToken = hashParams.get("accessToken");
        finalRefreshToken = hashParams.get("refreshToken");
        finalError = hashParams.get("error");
      }

      if (finalError) {
        const errorMessage = "Đăng nhập với Google thất bại!";

        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              message:
                finalError === ErrorCode.EMAIL_ALREADY_EXIST
                  ? ErrorCodeMap[ErrorCode.EMAIL_ALREADY_EXIST]
                  : errorMessage,
            },
            window.location.origin
          );
          window.close();
        } else {
          if (ErrorCode.EMAIL_ALREADY_EXIST === finalError) {
            toast.error(ErrorCodeMap[ErrorCode.EMAIL_ALREADY_EXIST]);
          } else {
            toast.error(errorMessage);
          }
          navigate("/login", { replace: true });
        }
        setIsProcessing(false);
        return;
      }

      if (!finalAccessToken) {
        const errorMessage = "Không nhận được token từ server!";

        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              message: errorMessage,
            },
            window.location.origin
          );
          window.close();
        } else {
          toast.error(errorMessage);
          navigate("/login", { replace: true });
        }
        setIsProcessing(false);
        return;
      }

      // Send message to opener window (parent)
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "GOOGLE_AUTH_SUCCESS",
            accessToken: finalAccessToken,
            refreshToken: finalRefreshToken,
          },
          window.location.origin
        );
        window.close();
      } else {
        // Fallback: nếu không có opener, lưu token và redirect
        saveToken(finalAccessToken, finalRefreshToken || undefined);
        navigate("/", { replace: true });
      }

      setIsProcessing(false);
    };

    handleGoogleCallback();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <Spinner className="h-12 w-12 mb-4" />
      <p className="text-lg text-muted-foreground">Đang xử lý đăng nhập...</p>
    </div>
  );
};

export default GoogleCallback;
