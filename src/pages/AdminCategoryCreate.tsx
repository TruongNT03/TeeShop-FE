import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminCategoryCreate = () => {
  return (
    <div className="w-[95%] mx-auto py-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl uppercase font-semibold">Tạo Danh Mục Mới</h1>
        <Button asChild variant="outline">
          <Link to="/admin/category">Quay lại</Link>
        </Button>
      </div>
      <Card className="p-6">
        <h2 className="text-lg font-medium">Form tạo danh mục</h2>
      </Card>
    </div>
  );
};

export default AdminCategoryCreate;