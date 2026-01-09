export const useFooter = () => {
  const footerColumns = [
    {
      title: "Thông tin công ty",
      items: [
        { title: "Về chúng tôi", to: "/about" },
        { title: "Bài viết mới nhất", to: "/posts" },
        { title: "Liên hệ", to: "/contact" },
        { title: "Cửa hàng", to: "/shop" },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        { title: "Theo dõi đơn hàng", to: "/tracking" },
        { title: "Trạng thái đơn hàng", to: "/order-status" },
        { title: "Giao hàng", to: "/delivery" },
        { title: "Thông tin vận chuyển", to: "/shipping" },
        { title: "Câu hỏi thường gặp", to: "/faq" },
      ],
    },
    {
      title: "Liên kết hữu ích",
      items: [
        { title: "Ưu đãi đặc biệt", to: "/offers" },
        { title: "Thẻ quà tặng", to: "/gift-cards" },
        { title: "Quảng cáo", to: "/advertising" },
        { title: "Điều khoản sử dụng", to: "/terms" },
      ],
    },
  ];
  return { footerColumns };
};
