import { Modal } from 'antd';
const CustomModal = ({ title, open, setOpen, contents }) => {
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Modal title={title} open={open} onOk={handleOk} onCancel={handleCancel}>
      {contents}
    </Modal>
  );
};

export default CustomModal;
