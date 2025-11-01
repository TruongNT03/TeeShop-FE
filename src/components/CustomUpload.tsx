import { Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CustomUpload = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewImageSource, setPreviewImageSource] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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
  return (
    <div className="w-full border-dotted border-2 hover:border-blue-500 p-8 rounded-lg flex items-center justify-center">
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <ImgCrop rotationSlider>
          <Upload
            customRequest={({ file, onSuccess }) => {
              // Giả upload thành công sau khi crop
              setTimeout(() => {
                onSuccess?.("ok");
              }, 0);
            }}
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
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
