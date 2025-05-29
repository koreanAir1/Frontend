import styled from "styled-components";
import CustomHeader from "../../components/header";
import { useScrollUp } from "../../hooks";
import { COLORS } from "../../constants";
const CustomLayout = ({ children }) => {
  useScrollUp();
  return (
    <Container>
      <CustomHeader />
      <ContentContainer>
        <CustomContents>{children}</CustomContents>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.BACKGROUND};
  width: 100vw;
  height: 100vh;
`;

const CustomContents = styled.div`
  width: 100%;
  margin: 0;
  padding: 10vh 8vw;
  box-sizing: border-box;
  display: block;
`;

export default CustomLayout;
