import CustomButton from '../../components/button';
import CustomModal from '../../components/modal';
import { COLORS } from '../../constants';
import { useState } from 'react';
import CustomText from '../../components/text';
const Details = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  return (
    <>
      <div>details</div>
      <CustomButton
        text={'피드백 하기'}
        color={COLORS.BLACK}
        backgroundColor={COLORS.WHITE}
        onClick={showModal}
      ></CustomButton>
      <CustomModal
        title={
          <CustomText
            text={'피드백 하기'}
            color={COLORS.BLUE}
            fontFamily={'Korean Air Sans Bold'}
            fontSize={'1.2rem'}
          ></CustomText>
        }
        open={open}
        setOpen={setOpen}
        contents={'안녕'}
      ></CustomModal>
    </>
  );
};

export default Details;
