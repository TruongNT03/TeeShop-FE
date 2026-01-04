import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export interface AdminChatContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AdminChatContext = createContext<AdminChatContextType | undefined>(
  undefined
);

export const AdminChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <AdminChatContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AdminChatContext.Provider>
  );
};

export const useAdminChatContext = () => {
  const context = useContext(AdminChatContext);
  if (!context) {
    throw new Error(
      "useAdminChatContext must be used within AdminChatProvider"
    );
  }
  return context;
};
