import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form } from "react-hook-form";

const AdminCreateProduct = () => {
  return (
    <div className="w-[95%] mx-auto">
      <div className="text-2xl font-semibold mb-5">Create product</div>
      <Card>
        <div className="ml-auto mr-5">
          <Button variant="outline" className="w-fit mr-3">
            Save as Draft
          </Button>
          <Button className="w-fit bg-blue-500 hover:bg-blue-600">
            Published
          </Button>
        </div>
        <div className="px-5 flex gap-8">
          <Form>
            <div className="flex-[3]">
              <div className="flex gap gap-8">
                <Input />
                <Input />
              </div>
            </div>
            <Card className="flex-[1]"></Card>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default AdminCreateProduct;
