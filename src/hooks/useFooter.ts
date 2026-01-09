export const useFooter = () => {
  const footerColumns = [
    {
      title: "Company Info",
      items: [
        { title: "About Us", to: "/about" },
        { title: "Latest Posts", to: "/posts" },
        { title: "Contact Us", to: "/contact" },
        { title: "Shop", to: "/shop" },
      ],
    },
    {
      title: "Help Links",
      items: [
        { title: "Tracking", to: "/tracking" },
        { title: "Order Status", to: "/order-status" },
        { title: "Delivery", to: "/delivery" },
        { title: "Shipping Info", to: "/shipping" },
        { title: "FAQ", to: "/faq" },
      ],
    },
    {
      title: "Useful Links",
      items: [
        { title: "Special Offers", to: "/offers" },
        { title: "Gift Cards", to: "/gift-cards" },
        { title: "Advertising", to: "/advertising" },
        { title: "Terms of Use", to: "/terms" },
      ],
    },
  ];
  return { footerColumns };
};
