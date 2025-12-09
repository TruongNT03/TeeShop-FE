import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Save,
  Loader2,
  Bot,
  Search,
  SquarePen,
  ArrowUpDown,
  Download,
  Upload,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetChatbotData,
  useGetChatbotSummary,
  useCreateChatbot,
  useUpdateChatbot,
  useDeleteChatbot,
  useRetrainingModel,
  useDownloadTemplate,
  useUploadFaqFile,
} from "../queries/chatbotQueries";
import type { AdminFaqResponseDto } from "../api";
import { PaginationControl } from "@/components/ui/pagination";

// FAQ type categories based on API
const FAQ_CATEGORIES = [
  "Chính sách đổi trả",
  "Vận chuyển",
  "Thanh toán",
  "Sản phẩm",
  "Tài khoản",
  "Khuyến mãi",
  "Chăm sóc khách hàng",
  "Đặt hàng",
  "Bảo mật",
  "Thành viên",
  "Nước hoa",
] as const;

const AdminChatbotConfig = () => {
  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [editingQA, setEditingQA] = useState<AdminFaqResponseDto | null>(null);
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: "question" as "question" | "answer" | "type",
    sortOrder: "DESC" as "DESC" | "ASC",
  });
  const [newQA, setNewQA] = useState({
    question: "",
    answer: "",
    type: "" as (typeof FAQ_CATEGORIES)[number] | "",
  });

  // API queries and mutations
  const { data, isLoading } = useGetChatbotData(query);

  const { data: summaryData } = useGetChatbotSummary();

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  const createMutation = useCreateChatbot();
  const updateMutation = useUpdateChatbot();
  const deleteMutation = useDeleteChatbot();
  const retrainingMutation = useRetrainingModel();
  const downloadTemplateMutation = useDownloadTemplate();
  const uploadFaqFileMutation = useUploadFaqFile();

  const qaPairs = data?.data || [];
  const pagination = {
    totalItem: data?.paginate?.totalItem || 0,
    totalPage: data?.paginate?.totalPage || 1,
    currentPage: query.page,
  };

  const handleSort = (field: "question" | "answer" | "type") => {
    const isCurrentSort = query.sortBy === field;
    setQuery((prevQuery) => ({
      ...prevQuery,
      sortBy: field,
      sortOrder:
        isCurrentSort && prevQuery.sortOrder === "DESC" ? "ASC" : "DESC",
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPage) return;
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: newPage,
    }));
  };

  const handleAddQA = async () => {
    if (!newQA.question.trim() || !newQA.answer.trim() || !newQA.type) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    await createMutation.mutateAsync({
      question: newQA.question,
      answer: newQA.answer,
      type: newQA.type as (typeof FAQ_CATEGORIES)[number],
    });

    setNewQA({ question: "", answer: "", type: "" });
    setIsAddModalOpen(false);
  };

  const handleEditQA = async () => {
    if (!editingQA) return;

    await updateMutation.mutateAsync({
      id: editingQA.id,
      data: {
        question: editingQA.question,
        answer: editingQA.answer,
        type: editingQA.type,
      },
    });

    setIsEditModalOpen(false);
    setEditingQA(null);
  };

  const handleDeleteQA = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleTrainModel = async () => {
    await retrainingMutation.mutateAsync();
  };

  const handleDownloadTemplate = async () => {
    await downloadTemplateMutation.mutateAsync();
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Vui lòng chọn file Excel (.xlsx, .xls)");
      return;
    }

    await uploadFaqFileMutation.mutateAsync(file);
    // Reset input
    event.target.value = "";
  };

  const openEditModal = (qa: AdminFaqResponseDto) => {
    setEditingQA({ ...qa });
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full overflow-auto py-5">
      <div className="w-[95%] mx-auto font-semibold text-2xl mb-5">
        Cấu hình Chatbot
      </div>

      {/* Summary Cards */}
      <div className="w-[95%] flex justify-between mx-auto gap-8 mb-10">
        <Card className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng câu hỏi</p>
              <p className="text-2xl font-bold mt-2">
                {summaryData?.totalFaqs || 0}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Danh mục</p>
              <p className="text-2xl font-bold mt-2">
                {summaryData?.totalFaqCategories || 0}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">#</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-6 col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái Model</p>
              <div className="flex items-center gap-2 mt-2">
                {summaryData?.latestTraining ? (
                  <>
                    <Badge
                      variant="default"
                      className={
                        summaryData.latestTraining.status === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
                    >
                      {summaryData.latestTraining.status === "success"
                        ? "Thành công"
                        : "Thất bại"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Cập nhật lần cuối:{" "}
                      {new Date(
                        summaryData.latestTraining.updatedAt
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </>
                ) : (
                  <Badge variant="outline">Chưa huấn luyện</Badge>
                )}
              </div>
            </div>
            <Bot className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="w-[95%] mx-auto mb-5 flex justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Input
              className="w-[400px] py-0 pl-10"
              type="search"
              placeholder="Tìm theo câu hỏi, câu trả lời..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="scale-75 absolute top-[18%] left-2 text-slate-400" />
          </div>
          <Button
            onClick={handleDownloadTemplate}
            disabled={downloadTemplateMutation.isPending}
            variant="outline"
          >
            {downloadTemplateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Tải Template
              </>
            )}
          </Button>
          <Button
            variant="outline"
            disabled={uploadFaqFileMutation.isPending}
            onClick={() => document.getElementById("faq-upload-input")?.click()}
          >
            {uploadFaqFileMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Tải lên File
              </>
            )}
          </Button>
          <input
            id="faq-upload-input"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleUploadFile}
          />
          <Button
            onClick={handleTrainModel}
            disabled={retrainingMutation.isPending}
            variant="outline"
          >
            {retrainingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang huấn luyện...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Huấn luyện lại Model
              </>
            )}
          </Button>
        </div>
        <div>
          <Button variant="default" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo câu hỏi
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="w-[95%] mx-auto py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="pl-8">
                <div>No.</div>
              </TableHead>
              <TableHead className="py-5">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("question")}
                >
                  Câu hỏi{" "}
                  <span className="ml-1">
                    <ArrowUpDown className="scale-[60%]" />
                  </span>
                </div>
              </TableHead>
              <TableHead className="py-5">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("answer")}
                >
                  Câu trả lời{" "}
                  <span className="ml-1">
                    <ArrowUpDown className="scale-[60%]" />
                  </span>
                </div>
              </TableHead>
              <TableHead className="py-5">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  Loại{" "}
                  <span className="ml-1">
                    <ArrowUpDown className="scale-[60%]" />
                  </span>
                </div>
              </TableHead>
              <TableHead className="py-5">
                <div>Hành động</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <Spinner className="w-10 h-10" />
                </TableCell>
              </TableRow>
            ) : qaPairs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-lg">
                  Không tìm thấy câu hỏi nào.
                </TableCell>
              </TableRow>
            ) : (
              qaPairs.map((qa, index) => (
                <TableRow
                  key={qa.id}
                  className={`${index % 2 ? "bg-muted" : ""}`}
                >
                  <TableCell className="pl-8">
                    {index + 1 + (query.page - 1) * query.pageSize}
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px]">
                    {qa.question}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[400px] truncate">
                    {qa.answer}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-primary text-primary"
                    >
                      {qa.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <SquarePen
                        className="scale-75 text-primary cursor-pointer"
                        onClick={() => openEditModal(qa)}
                      />
                      <Trash2
                        className={`scale-75 text-destructive cursor-pointer ${
                          deleteMutation.isPending
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                        onClick={() => handleDeleteQA(qa.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="w-full py-3 flex justify-between items-center px-5">
          <div className="text-sm text-muted-foreground">
            Tổng: <b>{pagination.totalItem}</b> câu hỏi
          </div>

          <PaginationControl
            currentPage={pagination.currentPage}
            totalPage={pagination.totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>

      {/* Add QA Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm câu hỏi mới</DialogTitle>
            <DialogDescription>
              Thêm câu hỏi và câu trả lời để huấn luyện chatbot
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Câu hỏi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Nhập câu hỏi..."
                value={newQA.question}
                onChange={(e) =>
                  setNewQA((prev) => ({ ...prev, question: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Câu trả lời <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Nhập câu trả lời..."
                value={newQA.answer}
                onChange={(e) =>
                  setNewQA((prev) => ({ ...prev, answer: e.target.value }))
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newQA.type}
                onValueChange={(value) =>
                  setNewQA((prev) => ({
                    ...prev,
                    type: value as (typeof FAQ_CATEGORIES)[number],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {FAQ_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={createMutation.isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleAddQA} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm câu hỏi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit QA Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
            <DialogDescription>
              Cập nhật câu hỏi và câu trả lời
            </DialogDescription>
          </DialogHeader>

          {editingQA && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Câu hỏi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Nhập câu hỏi..."
                  value={editingQA.question}
                  onChange={(e) =>
                    setEditingQA((prev) =>
                      prev ? { ...prev, question: e.target.value } : null
                    )
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Câu trả lời <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Nhập câu trả lời..."
                  value={editingQA.answer}
                  onChange={(e) =>
                    setEditingQA((prev) =>
                      prev ? { ...prev, answer: e.target.value } : null
                    )
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Danh mục <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={editingQA.type}
                  onValueChange={(value) =>
                    setEditingQA((prev) =>
                      prev
                        ? {
                            ...prev,
                            type: value as (typeof FAQ_CATEGORIES)[number],
                          }
                        : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateMutation.isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleEditQA} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChatbotConfig;
