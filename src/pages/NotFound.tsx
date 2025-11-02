import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Soft Blue Radial Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
       radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)
     `,
        }}
      />
      {/* Your Content Here */}
      <div className="w-full min-h-screen relative z-10 flex flex-col justify-center items-center">
        <img src="not-found.png" alt="" className="w-96" />
        <div className="text-2xl font-bold mt-8">Đi đâu đấy bạn ơi?</div>
        <Link to={"/"}>
          <Button variant="secondary" className="mt-8 text-primary">
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;