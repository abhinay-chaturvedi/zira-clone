import { parseAsBoolean, useQueryState } from "nuqs";

const useCreateProjectModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-project",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return {
    open,
    close,
    isOpen,
    setIsOpen
  }
};
export default useCreateProjectModal;
