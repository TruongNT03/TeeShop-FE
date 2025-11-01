import PolicyItem, { type PolicyItemProps } from "./PolicyItem";

interface PolicyProps {
  items: PolicyItemProps[];
}

const Policy = (props: PolicyProps) => {
  return (
    <section id="our-policies" className="w-full px-[65px] pb-[24px]">
      <div
        className="text-5xl font-semibold text-shadow-lg cursor-pointer text-center"
        onClick={() => {
          document.getElementById("our-policies")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Our Policies
      </div>
      <div className="w-full h-[211px] flex gap-10 items-center">
        {props.items.map((policy, index) => (
          <>
            <PolicyItem
              key={index}
              icon={policy.icon}
              title={policy.title}
              description={policy.description}
            />
            {index !== props.items.length - 1 ? (
              <div className="h-[48px] w-[1px] bg-custom-primary"></div>
            ) : (
              <></>
            )}
          </>
        ))}
      </div>
    </section>
  );
};

export default Policy;
