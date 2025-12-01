import PolicyItem, { type PolicyItemProps } from "./PolicyItem";

interface PolicyProps {
  items: PolicyItemProps[];
}

const Policy = (props: PolicyProps) => {
  return (
    <section
      id="our-policies"
      className="w-full px-4 md:px-8 lg:px-[65px] pb-4 md:pb-6 lg:pb-[24px]"
    >
      <div
        className="text-3xl md:text-4xl lg:text-5xl font-semibold text-shadow-lg cursor-pointer text-center mb-6 md:mb-8"
        onClick={() => {
          document.getElementById("our-policies")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Our Policies
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 py-4 md:py-6">
        {props.items.map((policy, index) => (
          <div key={index} className="relative">
            <PolicyItem
              icon={policy.icon}
              title={policy.title}
              description={policy.description}
            />
            {index !== props.items.length - 1 && (
              <div className="hidden lg:block absolute top-0 -right-5 h-full w-[1px] bg-custom-primary"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Policy;
