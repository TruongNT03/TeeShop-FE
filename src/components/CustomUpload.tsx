import { Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { uploadProductImageMutation } from "@/queries/adminProductQueries";
import axios from "axios";
import { toast } from "sonner";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface CustomUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
}

const CustomUpload = ({ value = [], onChange }: CustomUploadProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewImageSource, setPreviewImageSource] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uploadMutation = uploadProductImageMutation();

  useEffect(() => {
    const internalUrls = fileList
      .filter((f) => f.status === "done" && f.url)
      .map((f) => f.url as string);

    if (
      value.length !== internalUrls.length ||
      !value.every((url) => internalUrls.includes(url))
    ) {
      setFileList(
        value.map((url, index) => ({
          uid: `${url}-${index}`,
          name: url.split("/").pop() || `image-${index}`,
          status: "done",
          url: url,
        }))
      );
    }
  }, [value]);

  const onAntdChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const newUrls = newFileList
      .filter((file) => file.status === "done" && file.url)
      .map((file) => file.url as string);

    if (onChange) {
      onChange(newUrls);
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    setIsPreviewOpen(true);
    setPreviewImageSource(image.src);
  };

  const customUploadRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;
    const fileObj = file as File;

    try {
      const uploadData = {
        fileName: fileObj.name,
        contentType: fileObj.type,
      };

      const response = await uploadMutation.mutateAsync(uploadData);
      const { presignUrl, fileUrl } = response.data;

      await axios.put(presignUrl, fileObj, {
        headers: {
          "Content-Type": fileObj.type,
        },
        onUploadProgress: (event) => {
          if (event.total) {
            onProgress?.({ percent: (event.loaded / event.total) * 100 });
          }
        },
      });

      (file as UploadFile).url = fileUrl;
      onSuccess?.({ fileUrl }, file as any);
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error("Tải ảnh lên thất bại.");
      onError?.(error);
    }
  };

  return (
    <div className="w-full border-dotted border-2 hover:border-blue-500 p-8 rounded-lg flex items-center justify-center">
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <ImgCrop rotationSlider>
          <Upload
            customRequest={customUploadRequest}
            listType="picture-card"
            fileList={fileList}
            onChange={onAntdChange}
            onPreview={onPreview}
          >
            {fileList.length < 5 && "+ Upload"}
          </Upload>
        </ImgCrop>
        {isPreviewOpen && (
          <DialogContent className="w-150 p-10">
            <img
              src={previewImageSource}
              alt="img"
              className="rounded-lg w-full"
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default CustomUpload;
