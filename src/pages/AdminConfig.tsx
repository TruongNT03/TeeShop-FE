import { Card } from "@/components/ui/card";
import { Switch } from "antd";
import { Carousel, InputNumber, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface CarouselConfig {
  autoPlay: boolean;
  duration: number;
  speed: number;
  imageUrls: string[];
}

// Mock data
const initialConfig: CarouselConfig = {
  autoPlay: true,
  duration: 3000, // 3 seconds
  speed: 500, // 0.5 seconds
  imageUrls: [
    "https://images.squarespace-cdn.com/content/v1/6150da9bc04b0a138b3c0600/1634528500503-V7KPRTKGCRB73IY6IKB9/Stone-Circle.jpg",
    "https://cdn.thecollector.com/wp-content/uploads/2023/07/who-is-andy-goldsworthy.jpg",
    "https://thumbs.dreamstime.com/b/smooth-pebbles-beach-natural-stones-seashore-grey-brown-neutral-colors-cobbles-closeup-random-shapes-round-oval-coastal-scene-385459675.jpg",
    "https://thumbs.dreamstime.com/b/zen-balancing-rocks-pebbles-covered-water-concept-50767042.jpg",
    "https://media.gettyimages.com/id/157373207/photo/balanced-stones-on-a-pebble-beach-during-sunset.jpg?s=612x612&w=gi&k=20&c=o2EIbVkoOYim9J_rHm0YUic16Sl42MuKgS9GOOH6_xU=",
  ],
};

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableUploadProps {
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
  id: string;
}

const SortableUpload = ({ id, fileList, onChange }: SortableUploadProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={({ fileList: newFileList }) =>
          onChange(newFileList.slice(-1))
        }
        maxCount={1}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </div>
  );
};

const AdminConfig = () => {
  const [config, setConfig] = useState<CarouselConfig>(initialConfig);
  const [banners, setBanners] = useState<UploadFile[][]>([[], [], [], [], []]);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleChange = (index: number, newList: UploadFile[]) => {
    const newBanners = [...banners];
    newBanners[index] = newList;
    setBanners(newBanners);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((_, i) => `banner-${i}` === active.id);
    const newIndex = banners.findIndex((_, i) => `banner-${i}` === over.id);

    setBanners((prev) => arrayMove(prev, oldIndex, newIndex));
  };
  return (
    <div className="w-full p-8">
      <div className="text-2xl uppercase font-semibold mb-5">
        Website Configuration
      </div>

      <Card className="w-full overflow-y-auto h-screen flex flex-row">
        <div className="flex-[1]"></div>
        <div className="flex-[5] px-5">
          <Card className="px-5 py-4">
            <div className="font-semibold mb-4 text-lg">Banner</div>

            <div className="w-full flex">
              <div className="flex-1 flex flex-col items-start justify-between py-12">
                <div className="flex gap-8 items-center w-full">
                  <div className="flex gap-2 items-center">
                    <div>Auto play:</div>
                    <Switch
                      className="cursor-pointer"
                      checked={config.autoPlay}
                      onChange={(checked) =>
                        setConfig((prev) => ({ ...prev, autoPlay: checked }))
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <div>Duration:</div>
                    <InputNumber
                      value={config.duration}
                      onChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          duration: value || 3000,
                        }))
                      }
                      min={1000}
                      max={10000}
                      step={500}
                    />
                    <div>{"milliseconds."}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>Speed:</div>
                  <InputNumber
                    value={config.speed}
                    onChange={(value) =>
                      setConfig((prev) => ({ ...prev, speed: value || 0 }))
                    }
                    min={100}
                    max={1000}
                    step={100}
                  />
                  <div>{"milliseconds."}</div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>Images:</div>
                  <div className="flex flex-col gap-10 w-full">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={banners.map((_, i) => `banner-${i}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="grid grid-cols-5 gap-3">
                          {banners.map((fileList, index) => (
                            <SortableUpload
                              key={`banner-${index}`}
                              id={`banner-${index}`}
                              fileList={fileList}
                              onChange={(newList) =>
                                handleChange(index, newList)
                              }
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              </div>

              <div className="flex-1 pl-4 max-w-[600px] overflow-hidden">
                <Carousel
                  autoplay={config.autoPlay}
                  autoplaySpeed={config.duration}
                  draggable
                  easing="ease-in-out"
                  speed={config.speed}
                  pauseOnHover={false}
                  dots
                >
                  {config.imageUrls.map((url) => (
                    <div className="overflow-hidden">
                      <img
                        src={url}
                        className="w-full h-[400px] object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default AdminConfig;
