import styled from 'styled-components';

const CustomButton = ({
  text,
  color,
  width,
  height,
  backgroundColor,
  fontSize,
  onClick,
  borderColor,
  fontFamily,
  borderRadius,
  marginTop,
  fontWeight,
  boxShadow,
}) => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: color,
    width: width,
    height: height,
    backgroundColor: backgroundColor,
    border: `1px solid ${borderColor}`,
    fontSize: fontSize,
    fontFamily: fontFamily,
    borderRadius: borderRadius,
    marginTop: marginTop,
    fontWeight: fontWeight,
    boxShadow: boxShadow,
  };

  return (
    <Container style={style} onClick={onClick}>
      {text}
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
`;

export default CustomButton;
