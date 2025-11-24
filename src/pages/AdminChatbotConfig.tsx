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
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QAPair {
  id: string;
  question: string;
  answer: string;
  category?: string;
  createdAt: string;
}

// Mock data
const mockQAPairs: QAPair[] = [
  {
    id: "1",
    question: "Làm thế nào để đặt hàng?",
    answer:
      "Bạn có thể đặt hàng bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.",
    category: "Đặt hàng",
    createdAt: "2024-11-20",
  },
  {
    id: "2",
    question: "Chính sách đổi trả như thế nào?",
    answer:
      "Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm còn nguyên vẹn.",
    category: "Chính sách",
    createdAt: "2024-11-20",
  },
];

const AdminChatbotConfig = () => {
  const [qaPairs, setQaPairs] = useState<QAPair[]>(mockQAPairs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingQA, setEditingQA] = useState<QAPair | null>(null);
  const [newQA, setNewQA] = useState({
    question: "",
    answer: "",
    category: "",
  });

  const filteredQAPairs = qaPairs.filter(
    (qa) =>
      qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddQA = async () => {
    if (!newQA.question.trim() || !newQA.answer.trim()) {
      toast.error("Vui lòng điền đầy đủ câu hỏi và câu trả lời!");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Call API to add QA pair
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPair: QAPair = {
        id: Date.now().toString(),
        question: newQA.question,
        answer: newQA.answer,
        category: newQA.category || undefined,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setQaPairs((prev) => [newPair, ...prev]);
      setNewQA({ question: "", answer: "", category: "" });
      setIsAddModalOpen(false);
      toast.success("Đã thêm câu hỏi thành công!");
    } catch (error) {
      toast.error("Thêm câu hỏi thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditQA = async () => {
    if (!editingQA) return;

    setIsSaving(true);
    try {
      // TODO: Call API to update QA pair
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setQaPairs((prev) =>
        prev.map((qa) => (qa.id === editingQA.id ? editingQA : qa))
      );
      setIsEditModalOpen(false);
      setEditingQA(null);
      toast.success("Đã cập nhật câu hỏi thành công!");
    } catch (error) {
      toast.error("Cập nhật câu hỏi thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQA = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;

    try {
      // TODO: Call API to delete QA pair
      await new Promise((resolve) => setTimeout(resolve, 500));

      setQaPairs((prev) => prev.filter((qa) => qa.id !== id));
      toast.success("Đã xóa câu hỏi!");
    } catch (error) {
      toast.error("Xóa câu hỏi thất bại!");
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      // TODO: Call API to train model
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Đã huấn luyện lại model thành công!");
    } catch (error) {
      toast.error("Huấn luyện model thất bại!");
    } finally {
      setIsTraining(false);
    }
  };

  const openEditModal = (qa: QAPair) => {
    setEditingQA({ ...qa });
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8" />
            Cấu hình Chatbot
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý dữ liệu huấn luyện và training chatbot AI
          </p>
        </div>
        <Button
          onClick={handleTrainModel}
          disabled={isTraining}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isTraining ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang huấn luyện...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-5 w-5" />
              Huấn luyện lại Model
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng câu hỏi</p>
                <p className="text-2xl font-bold">{qaPairs.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Danh mục</p>
                <p className="text-2xl font-bold">
                  {
                    new Set(qaPairs.map((qa) => qa.category).filter(Boolean))
                      .size
                  }
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">#</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Trạng thái Model
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="bg-green-500">
                    Đã được huấn luyện
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Cập nhật lần cuối: 24/11/2024
                  </span>
                </div>
              </div>
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách Câu hỏi - Câu trả lời</CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm câu hỏi, câu trả lời hoặc danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Separator className="mb-4" />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Câu hỏi</TableHead>
                  <TableHead className="w-[40%]">Câu trả lời</TableHead>
                  <TableHead className="w-[15%]">Danh mục</TableHead>
                  <TableHead className="w-[15%] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQAPairs.length > 0 ? (
                  filteredQAPairs.map((qa) => (
                    <TableRow key={qa.id}>
                      <TableCell className="font-medium">
                        {qa.question}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {qa.answer.length > 100
                          ? `${qa.answer.substring(0, 100)}...`
                          : qa.answer}
                      </TableCell>
                      <TableCell>
                        {qa.category && (
                          <Badge variant="outline">{qa.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(qa)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteQA(qa.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "Không tìm thấy kết quả"
                          : "Chưa có câu hỏi nào. Thêm câu hỏi đầu tiên!"}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
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
              <Label>Danh mục (Tùy chọn)</Label>
              <Input
                placeholder="VD: Đặt hàng, Chính sách, Thanh toán..."
                value={newQA.category}
                onChange={(e) =>
                  setNewQA((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button onClick={handleAddQA} disabled={isSaving}>
              {isSaving ? (
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
                <Label>Danh mục (Tùy chọn)</Label>
                <Input
                  placeholder="VD: Đặt hàng, Chính sách, Thanh toán..."
                  value={editingQA.category || ""}
                  onChange={(e) =>
                    setEditingQA((prev) =>
                      prev ? { ...prev, category: e.target.value } : null
                    )
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button onClick={handleEditQA} disabled={isSaving}>
              {isSaving ? (
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
